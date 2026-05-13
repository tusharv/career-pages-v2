#!/usr/bin/env python3
"""
Fetch job links from each company's careers_url HTML page and sync them to
Supabase `openings`. Company detail pages already read from that table, so no
app code changes are required after a successful run.

Requirements:
  pip install -r scripts/requirements-fetch-openings.txt

Environment (same as the TypeScript seed script; load from .env / .env.local):
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY

Usage:
  python scripts/fetch_openings.py
  python scripts/fetch_openings.py --slug adobe --dry-run
  python scripts/fetch_openings.py --max-per-company 30 --sleep 1.5
  python scripts/fetch_openings.py --site https://company.com/careers --approve
  python scripts/fetch_openings.py --site https://company.com/careers --slug adobe --approve
  python scripts/fetch_openings.py --slug adobe --render-js --wait-after-load 3
  python scripts/fetch_openings.py --slug adobe --openings-file openings.csv --approve
  python scripts/fetch_openings.py --slug adobe --feed-url https://example.com/jobs.rss

Alternatives when scraping fails (bot protection, heavy JS, geo blocks):
  - Use --openings-file with CSV (columns url,title) or JSON ([{"url","title"}, ...])
    exported from the careers site or copied from the browser.
  - Use --feed-url if the employer publishes RSS/Atom (common on some ATS/blog hosts).
  - Per-vendor APIs (Greenhouse/Lever/Ashby public job APIs) for companies that use them.
  - Manual browser + DevTools Network tab to find the JSON list endpoint, then curl it.

Limitations:
  There is no single fetch strategy that works for every careers site; combine
  HTML heuristics, --render-js, feeds, and file import as needed.
  WordPress sites using the YMC Smart Filter plugin load jobs via admin-ajax
  (action ymc_get_posts); the script calls that when it finds _smart_filter_object
  in the page HTML.
"""

from __future__ import annotations

import argparse
import csv
import html as html_module
import json
import re
import textwrap
import sys
import time
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from io import StringIO
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import quote, urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import dotenv_values

try:
    from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover - optional dependency
    sync_playwright = None
    PlaywrightTimeoutError = Exception

# Paths that often indicate a single job posting (heuristic, not exhaustive)
JOB_PATH_HINTS = re.compile(
    r"(job|jobs|opening|openings|position|positions|requisition|"
    r"vacancy|vacancies|listing|role|roles|career|careers|"
    r"apply|opportunity|opportunities|req/|/r/|/j/)",
    re.I,
)

GENERIC_TITLE_HINTS = re.compile(
    r"^(careers?|jobs?|openings?|view|learn|read|more|details?|apply|join us|"
    r"our team|explore|see all|search|filter|next|previous)$",
    re.I,
)

JOB_DETAIL_HINTS = re.compile(
    r"(job|jobs|opening|position|requisition|vacancy|role|opportunity|apply|"
    r"/job/|/jobs/|/positions/|/careers/.+|req(id)?=|jobid=|gh_jid=|lever-"
    r"|greenhouse|workdayjobs|smartrecruiters|ashby)",
    re.I,
)

JOB_ID_HINTS = re.compile(r"(?:/|=)(?:\d{4,}|[a-z]{2,}-\d{3,})(?:/|$)", re.I)

GENERIC_LANDING_PATHS = {
    "/career",
    "/careers",
    "/careers/",
    "/jobs",
    "/jobs/",
    "/openings",
    "/openings/",
    "/positions",
    "/positions/",
}

NON_JOB_FILE_EXTENSIONS = (
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".zip",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
)

DEFAULT_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
)


@dataclass(frozen=True)
class OpeningDraft:
    title: str | None
    url: str


def dedupe_openings(rows: list[OpeningDraft]) -> list[OpeningDraft]:
    seen: set[str] = set()
    out: list[OpeningDraft] = []
    for o in rows:
        u = o.url.strip()
        if not u or u in seen:
            continue
        seen.add(u)
        out.append(OpeningDraft(o.title, u))
    return out


def load_openings_from_path(path: Path) -> list[OpeningDraft]:
    text = path.read_text(encoding="utf-8-sig")
    suf = path.suffix.lower()
    if suf == ".json":
        data = json.loads(text)
        if isinstance(data, dict) and "openings" in data:
            data = data["openings"]
        if not isinstance(data, list):
            raise ValueError('JSON must be a list or {"openings": [...]}')
        rows: list[OpeningDraft] = []
        for item in data:
            if isinstance(item, str) and item.strip():
                rows.append(OpeningDraft(None, item.strip()))
            elif isinstance(item, dict):
                u = item.get("url") or item.get("link")
                if not u or not isinstance(u, str):
                    continue
                t = item.get("title") or item.get("name")
                title = str(t).strip() if t is not None else None
                rows.append(OpeningDraft(title or None, u.strip()))
        return dedupe_openings(rows)
    if suf in (".csv", ".tsv"):
        delim = "\t" if suf == ".tsv" else ","
        reader = csv.DictReader(StringIO(text), delimiter=delim)
        if not reader.fieldnames:
            return []
        rows = []
        lowered = {n.lower().strip(): n for n in reader.fieldnames if n}
        for raw in reader:
            row = {str(k): (v or "").strip() for k, v in raw.items() if k}
            url_key = next(
                (
                    lowered[k]
                    for k in ("url", "link", "href", "job_url", "job link")
                    if k in lowered
                ),
                None,
            )
            title_key = next(
                (
                    lowered[k]
                    for k in ("title", "name", "role", "job", "position")
                    if k in lowered
                ),
                None,
            )
            u = (row.get(url_key) if url_key else "").strip() if url_key else ""
            if not u:
                vals = [v for v in row.values() if v.startswith("http")]
                u = vals[0] if vals else ""
            if not u:
                continue
            t = (row.get(title_key) if title_key else "").strip() if title_key else ""
            rows.append(OpeningDraft(t or None, u))
        return dedupe_openings(rows)
    raise ValueError(f"Unsupported file type {suf!r}; use .json, .csv, or .tsv")


def xml_local(tag: str) -> str:
    if "}" in tag:
        return tag.split("}", 1)[1]
    return tag


def openings_from_feed_xml(xml_text: str) -> list[OpeningDraft]:
    root = ET.fromstring(xml_text)
    rows: list[OpeningDraft] = []
    for el in root.iter():
        if xml_local(el.tag) not in ("item", "entry"):
            continue
        title: str | None = None
        link: str | None = None
        for child in el:
            ln = xml_local(child.tag)
            if ln == "title" and (child.text or "").strip():
                title = " ".join(child.text.split())
            elif ln == "link":
                href = (child.attrib.get("href") or "").strip()
                if href:
                    link = href
                elif (child.text or "").strip():
                    link = child.text.strip()
        if link and link.startswith("http"):
            rows.append(OpeningDraft(title, link))
    return dedupe_openings(rows)


def fetch_openings_from_feed(
    session: requests.Session, feed_url: str, timeout: float
) -> list[OpeningDraft]:
    r = session.get(feed_url, timeout=timeout)
    r.raise_for_status()
    return openings_from_feed_xml(r.text)


def load_env() -> dict[str, str | None]:
    root = Path(__file__).resolve().parent.parent
    merged: dict[str, str | None] = {}
    for name in (".env.local", ".env"):
        path = root / name
        if path.is_file():
            merged.update({k: v for k, v in dotenv_values(path).items()})
    return merged


def registrable_host(netloc: str) -> str:
    host = netloc.split("@")[-1].split(":")[0].lower()
    parts = host.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return host


def same_site(careers_url: str, link: str) -> bool:
    try:
        a = urlparse(careers_url)
        b = urlparse(link)
    except ValueError:
        return False
    if b.scheme not in ("http", "https") or not b.netloc:
        return False
    return registrable_host(a.netloc) == registrable_host(b.netloc)


def looks_like_job_url(careers_url: str, absolute: str) -> bool:
    if not same_site(careers_url, absolute):
        # Embedded common ATS hosts often used in iframes / redirects
        low = absolute.lower()
        if any(
            x in low
            for x in (
                "greenhouse.io",
                "lever.co",
                "myworkdayjobs.com",
                "smartrecruiters.com",
                "ashbyhq.com",
            )
        ):
            return True
        return False
    parsed = urlparse(absolute)
    path = (parsed.path or "/").rstrip("/") or "/"
    if path.lower().endswith(NON_JOB_FILE_EXTENSIONS):
        return False
    low = absolute.lower()
    if path in GENERIC_LANDING_PATHS and not parsed.query:
        return False
    if JOB_DETAIL_HINTS.search(low) or JOB_ID_HINTS.search(low):
        return True
    if JOB_PATH_HINTS.search(path):
        # keep only likely detail pages, not broad landing pages
        segments = [s for s in path.split("/") if s]
        if len(segments) >= 2:
            return True
    # Deep paths under /careers/ etc. (weak signal)
    segments = [s for s in path.split("/") if s]
    if len(segments) >= 3 and JOB_PATH_HINTS.search("/".join(segments[:2])):
        return True
    return False


def collect_json_ld_job_urls(page_url: str, html: str) -> list[str]:
    out: list[str] = []
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.find_all("script", attrs={"type": "application/ld+json"}):
        raw = (tag.string or "").strip()
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        for node in iter_ld_nodes(data):
            if isinstance(node, dict):
                t = node.get("@type")
                types = t if isinstance(t, list) else ([t] if t else [])
                if any(str(x).lower() == "jobposting" for x in types if x):
                    u = node.get("url")
                    if isinstance(u, str) and u.strip():
                        abs_u = urljoin(page_url, u.strip())
                        if abs_u.startswith("http"):
                            out.append(abs_u)
    return out


def iter_ld_nodes(data: Any) -> Iterable[dict[str, Any]]:
    if isinstance(data, dict):
        yield data
        g = data.get("@graph")
        if isinstance(g, list):
            for item in g:
                yield from iter_ld_nodes(item)
    elif isinstance(data, list):
        for item in data:
            yield from iter_ld_nodes(item)


def collect_anchor_openings(careers_url: str, html: str) -> list[OpeningDraft]:
    soup = BeautifulSoup(html, "html.parser")
    base = careers_url
    seen: set[str] = set()
    rows: list[OpeningDraft] = []

    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith(("#", "javascript:", "mailto:", "tel:")):
            continue
        absolute = urljoin(base, href)
        if absolute in seen:
            continue
        if not looks_like_job_url(careers_url, absolute):
            continue
        text = " ".join(a.get_text(" ", strip=True).split())
        normalized_text = re.sub(r"[^a-z0-9 ]+", "", text.lower()).strip()
        if normalized_text and GENERIC_TITLE_HINTS.match(normalized_text):
            continue
        seen.add(absolute)
        title = text[:500] if text else None
        rows.append(OpeningDraft(title=title, url=absolute))
    return rows


def extract_smart_filter_object(page_html: str) -> dict[str, Any] | None:
    m = re.search(r"_smart_filter_object\s*=\s*(\{.*?\})\s*;", page_html, re.DOTALL)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def iter_ymc_filter_param_sets(page_html: str) -> Iterable[dict[str, Any]]:
    soup = BeautifulSoup(page_html, "html.parser")
    seen: set[str] = set()
    for el in soup.select("[data-params]"):
        raw = el.get("data-params")
        if not raw or "cpt" not in raw.lower():
            continue
        fixed = (
            raw.replace("&quot;", '"')
            .replace("&#039;", "'")
            .replace("&apos;", "'")
        )
        try:
            params = json.loads(fixed)
        except json.JSONDecodeError:
            continue
        if not isinstance(params, dict) or "filter_id" not in params:
            continue
        sig = json.dumps(params, sort_keys=True)
        if sig in seen:
            continue
        seen.add(sig)
        yield params


def fetch_ymc_posts_html(
    ajax_url: str,
    nonce: str,
    params: dict[str, Any],
    session: requests.Session,
    timeout: float,
    max_pages: int = 30,
) -> str:
    chunks: list[str] = []
    try:
        per_page = int(str(params.get("per_page", 10)))
    except ValueError:
        per_page = 10
    for page in range(1, max_pages + 1):
        payload = {
            "action": "ymc_get_posts",
            "nonce_code": nonce,
            "params": json.dumps(params),
            "paged": str(page),
        }
        try:
            r = session.post(ajax_url, data=payload, timeout=timeout)
            r.raise_for_status()
            body = r.json()
        except (requests.RequestException, ValueError, json.JSONDecodeError):
            break
        if not isinstance(body, dict):
            break
        frag = body.get("data")
        if not isinstance(frag, str) or "post-item" not in frag:
            break
        chunks.append(frag)
        if frag.count("post-item") < per_page:
            break
    return "".join(chunks)


def openings_from_ymc_html(html_fragment: str) -> list[OpeningDraft]:
    soup = BeautifulSoup(html_fragment, "html.parser")
    rows: list[OpeningDraft] = []
    for art in soup.find_all("article"):
        cls = art.get("class") or []
        if "post-item" not in cls:
            continue
        link = art.select_one("header.title a") or art.select_one("a.media-link")
        if not link or not link.get("href"):
            continue
        href = str(link["href"]).strip()
        if not href.startswith("http"):
            continue
        text = link.get_text(" ", strip=True)
        title = html_module.unescape(text)[:500] if text else None
        rows.append(OpeningDraft(title=title, url=href))
    return rows


def collect_ymc_smart_filter_openings(
    page_html: str,
    session: requests.Session,
    timeout: float,
) -> list[OpeningDraft]:
    obj = extract_smart_filter_object(page_html)
    if not obj:
        return []
    ajax_url = obj.get("ajax_url")
    nonce = obj.get("nonce")
    if not ajax_url or not nonce:
        return []
    merged = ""
    for params in iter_ymc_filter_param_sets(page_html):
        merged += fetch_ymc_posts_html(
            str(ajax_url), str(nonce), params, session, timeout
        )
    if not merged:
        return []
    return openings_from_ymc_html(merged)


def merge_openings(
    careers_url: str,
    html: str,
    max_n: int,
    session: requests.Session | None = None,
    timeout: float = 25.0,
) -> list[OpeningDraft]:
    by_url: dict[str, OpeningDraft] = {}
    for u in collect_json_ld_job_urls(careers_url, html):
        if u not in by_url:
            by_url[u] = OpeningDraft(title=None, url=u)
    if session is not None:
        for o in collect_ymc_smart_filter_openings(html, session, timeout):
            if o.url not in by_url:
                by_url[o.url] = o
            elif by_url[o.url].title is None and o.title:
                by_url[o.url] = o
    for o in collect_anchor_openings(careers_url, html):
        if o.url not in by_url:
            by_url[o.url] = o
        elif by_url[o.url].title is None and o.title:
            by_url[o.url] = o
    ordered = list(by_url.values())
    return ordered[:max_n]


def supabase_headers(service_key: str) -> dict[str, str]:
    return {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


def fetch_companies(
    base_url: str, service_key: str, slug: str | None
) -> list[dict[str, Any]]:
    url = f"{base_url.rstrip('/')}/rest/v1/companies?select=id,slug,name,careers_url"
    if slug:
        url += f"&slug=eq.{quote(slug, safe='')}"
    r = requests.get(url, headers=supabase_headers(service_key), timeout=60)
    r.raise_for_status()
    data = r.json()
    if not isinstance(data, list):
        raise RuntimeError("Unexpected companies response")
    return data


def print_candidates(openings: list[OpeningDraft]) -> None:
    if not openings:
        print("  no candidate links found")
        return
    print("  candidate links:")
    for idx, o in enumerate(openings, start=1):
        title = (o.title or "(no title)").strip()
        print(f"    [{idx}] {title}")
        print(f"        {o.url}")


def choose_approved_openings(openings: list[OpeningDraft]) -> list[OpeningDraft]:
    if not openings:
        return []
    print_candidates(openings)
    print(
        "  approve links: type 'all', 'none', or comma-separated indexes "
        "(example: 1,3,7)"
    )
    while True:
        raw = input("  approve> ").strip().lower()
        if raw in {"all", "a"}:
            return openings
        if raw in {"none", "n", ""}:
            return []
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        picked: list[int] = []
        valid = True
        for part in parts:
            if not part.isdigit():
                valid = False
                break
            i = int(part)
            if i < 1 or i > len(openings):
                valid = False
                break
            picked.append(i)
        if valid:
            unique = sorted(set(picked))
            return [openings[i - 1] for i in unique]
        print("  invalid input. use 'all', 'none', or indexes like 1,2,6")


def replace_openings(
    base_url: str,
    service_key: str,
    company_id: str,
    openings: list[OpeningDraft],
) -> None:
    rest = f"{base_url.rstrip('/')}/rest/v1/openings"
    h = supabase_headers(service_key)
    d = requests.delete(
        f"{rest}?company_id=eq.{company_id}",
        headers=h,
        timeout=120,
    )
    if d.status_code not in (200, 204):
        raise RuntimeError(f"DELETE openings failed: {d.status_code} {d.text}")

    if not openings:
        return

    payload = [
        {
            "company_id": company_id,
            "title": o.title,
            "url": o.url,
            "sort_order": i,
        }
        for i, o in enumerate(openings)
    ]
    ins = requests.post(rest, headers=h, data=json.dumps(payload), timeout=120)
    if ins.status_code not in (200, 201):
        raise RuntimeError(f"POST openings failed: {ins.status_code} {ins.text}")


def fetch_html(session: requests.Session, url: str, timeout: float) -> str | None:
    try:
        r = session.get(url, timeout=timeout, allow_redirects=True)
        ctype = (r.headers.get("Content-Type") or "").lower()
        if r.status_code >= 400:
            return None
        if "html" not in ctype and "text" not in ctype:
            return None
        return r.text
    except requests.RequestException:
        return None


FETCH_FAIL_HINT = (
    "Alternatives: --render-js --render-wait-until load --wait-after-load 6 | "
    "--feed-url <rss-or-atom> | --openings-file path/to.csv (see script docstring)."
)


def fetch_html_with_browser(
    url: str,
    timeout: float,
    wait_after_load: float,
    user_agent: str,
    wait_until: str,
) -> str | None:
    if sync_playwright is None:
        print(
            "Playwright not installed. Run: pip install playwright && playwright install",
            file=sys.stderr,
        )
        return None
    timeout_ms = max(int(timeout * 1000), 1000)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=["--disable-blink-features=AutomationControlled"],
            )
            context = browser.new_context(user_agent=user_agent, locale="en-US")
            page = context.new_page()
            page.goto(url, wait_until=wait_until, timeout=timeout_ms)
            if wait_after_load > 0:
                page.wait_for_timeout(int(wait_after_load * 1000))
            html = page.content()
            context.close()
            browser.close()
            return html
    except PlaywrightTimeoutError:
        return None
    except Exception:
        return None


def main() -> int:
    p = argparse.ArgumentParser(
        description=textwrap.dedent(__doc__).strip(),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--slug", help="Only process this company slug")
    p.add_argument("--dry-run", action="store_true", help="Do not write to DB")
    p.add_argument(
        "--site",
        help="Fetch from this site URL directly instead of company careers_url from DB",
    )
    p.add_argument(
        "--approve",
        action="store_true",
        help="Show candidates and only sync approved links",
    )
    p.add_argument("--max-per-company", type=int, default=50)
    p.add_argument("--timeout", type=float, default=25.0)
    p.add_argument("--sleep", type=float, default=0.0, help="Seconds between HTTP gets")
    p.add_argument(
        "--render-js",
        action="store_true",
        help="Use a headless browser and wait for page load before scraping",
    )
    p.add_argument(
        "--wait-after-load",
        type=float,
        default=3.0,
        help="Extra seconds to wait after navigation in --render-js mode",
    )
    p.add_argument(
        "--render-wait-until",
        choices=("load", "domcontentloaded", "networkidle"),
        default="load",
        help="page.goto wait predicate when using --render-js (networkidle often times out)",
    )
    p.add_argument(
        "--openings-file",
        metavar="PATH",
        help="Import openings from CSV (url,title) or JSON instead of scraping HTML",
    )
    p.add_argument(
        "--feed-url",
        metavar="URL",
        help="Import openings from an RSS or Atom feed URL",
    )
    args = p.parse_args()

    mode_count = sum(
        1 for x in (args.openings_file, args.feed_url, args.site) if x
    )
    if mode_count > 1:
        print(
            "Use only one of --openings-file, --feed-url, or --site at a time.",
            file=sys.stderr,
        )
        return 1

    session = requests.Session()
    session.headers.update({"User-Agent": DEFAULT_UA})

    def resolve_company_for_write() -> tuple[str, str, dict[str, Any]] | None:
        env = load_env()
        b = (env.get("NEXT_PUBLIC_SUPABASE_URL") or "").strip()
        k = (env.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
        if not b or not k:
            print(
                "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
                file=sys.stderr,
            )
            return None
        rows = fetch_companies(b, k, args.slug)
        if not rows:
            print("No company matched the provided --slug", file=sys.stderr)
            return None
        return b, k, rows[0]

    if args.openings_file:
        path = Path(args.openings_file).expanduser()
        if not path.is_file():
            print(f"File not found: {path}", file=sys.stderr)
            return 1
        try:
            openings = load_openings_from_path(path)
        except (ValueError, OSError, json.JSONDecodeError) as e:
            print(f"Could not read openings file: {e}", file=sys.stderr)
            return 1
        print(f"Loaded {len(openings)} opening(s) from {path}")
        approved = choose_approved_openings(openings) if args.approve else openings
        print(f"Approved {len(approved)} opening(s)")
        if args.dry_run:
            print_candidates(approved)
            return 0
        if not args.slug:
            print(
                "--slug is required to write imported openings to Supabase.",
                file=sys.stderr,
            )
            return 1
        resolved = resolve_company_for_write()
        if resolved is None:
            return 1
        base, key, row = resolved
        replace_openings(base, key, row["id"], approved)
        print(f"Synced openings to [{row['slug']}] {row['name']}")
        return 0

    if args.feed_url:
        try:
            openings = fetch_openings_from_feed(
                session, args.feed_url.strip(), args.timeout
            )
        except requests.RequestException as e:
            print(f"Feed fetch failed: {e}", file=sys.stderr)
            print(FETCH_FAIL_HINT, file=sys.stderr)
            return 1
        except ET.ParseError as e:
            print(f"Feed XML parse failed: {e}", file=sys.stderr)
            return 1
        print(f"Fetched {len(openings)} entr(y/ies) from {args.feed_url}")
        approved = choose_approved_openings(openings) if args.approve else openings
        print(f"Approved {len(approved)} opening(s)")
        if args.dry_run:
            print_candidates(approved)
            return 0
        if not args.slug:
            print(
                "--slug is required to write feed openings to Supabase.",
                file=sys.stderr,
            )
            return 1
        resolved = resolve_company_for_write()
        if resolved is None:
            return 1
        base, key, row = resolved
        replace_openings(base, key, row["id"], approved)
        print(f"Synced feed openings to [{row['slug']}] {row['name']}")
        return 0

    needs_db = not args.dry_run and (not args.site or bool(args.slug))
    base = ""
    key = ""
    companies: list[dict[str, Any]] = []
    if needs_db:
        env = load_env()
        base = (env.get("NEXT_PUBLIC_SUPABASE_URL") or "").strip()
        key = (env.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
        if not base or not key:
            print(
                "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
                file=sys.stderr,
            )
            return 1
        companies = fetch_companies(base, key, args.slug)
        if not companies:
            print("No companies matched.", file=sys.stderr)
            return 1

    if args.site:
        source_url = args.site.strip()
        html = (
            fetch_html_with_browser(
                source_url,
                args.timeout,
                args.wait_after_load,
                DEFAULT_UA,
                args.render_wait_until,
            )
            if args.render_js
            else fetch_html(session, source_url, args.timeout)
        )
        if not html:
            print(f"Unable to fetch HTML from {source_url}", file=sys.stderr)
            print(FETCH_FAIL_HINT, file=sys.stderr)
            return 1
        openings = merge_openings(
            source_url, html, args.max_per_company, session, args.timeout
        )
        print(f"Fetched {len(openings)} candidate opening(s) from {source_url}")
        approved = choose_approved_openings(openings) if args.approve else openings
        print(f"Approved {len(approved)} opening(s)")

        if args.dry_run:
            print("Dry run enabled; no DB changes made.")
            return 0
        if not args.slug:
            print(
                "No --slug given. Skipping DB write. Provide --slug to sync to that company.",
            )
            return 0
        if not companies:
            print("No company matched the provided --slug", file=sys.stderr)
            return 1
        row = companies[0]
        replace_openings(base, key, row["id"], approved)
        print(f"Synced approved openings to [{row['slug']}] {row['name']}")
        return 0

    if not companies:
        env = load_env()
        base = (env.get("NEXT_PUBLIC_SUPABASE_URL") or "").strip()
        key = (env.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
        if not base or not key:
            print(
                "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
                file=sys.stderr,
            )
            return 1
        companies = fetch_companies(base, key, args.slug)
        if not companies:
            print("No companies matched.", file=sys.stderr)
            return 1

    for row in companies:
        cid = row["id"]
        slug = row["slug"]
        name = row["name"]
        careers_url = row["careers_url"]
        print(f"Fetching [{slug}] {name} …", flush=True)
        html = (
            fetch_html_with_browser(
                careers_url,
                args.timeout,
                args.wait_after_load,
                DEFAULT_UA,
                args.render_wait_until,
            )
            if args.render_js
            else fetch_html(session, careers_url, args.timeout)
        )
        if args.sleep > 0:
            time.sleep(args.sleep)
        if not html:
            print(f"  skip: no HTML or error for {careers_url}")
            print(f"  {FETCH_FAIL_HINT}")
            continue
        openings = merge_openings(
            careers_url, html, args.max_per_company, session, args.timeout
        )
        print(f"  found {len(openings)} candidate opening(s)")
        approved = choose_approved_openings(openings) if args.approve else openings
        print(f"  approved {len(approved)} opening(s)")
        if args.dry_run:
            for o in approved[:10]:
                print(f"    - {(o.title or '')[:60]!s} {o.url}")
            if len(approved) > 10:
                print(f"    … and {len(approved) - 10} more")
            continue
        replace_openings(base, key, cid, approved)
        print("  synced to Supabase")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
