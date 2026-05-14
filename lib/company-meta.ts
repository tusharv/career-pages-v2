import type { CompanyMetaProfile } from "@/lib/types/company-meta";

const UNSPECIFIED = /^unspecified$/i;

/** Returns trimmed string or null if empty / "unspecified". */
export function metaPresent(value: string | null | undefined): string | null {
  if (value == null) return null;
  const t = String(value).trim();
  if (!t || UNSPECIFIED.test(t)) return null;
  return t;
}

export function formatMajorOffices(
  value: string | string[] | null | undefined
): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    const parts = value.map((s) => metaPresent(s)).filter(Boolean) as string[];
    return parts.length ? parts.join(", ") : null;
  }
  return metaPresent(value);
}

export type CompanyListMeta = {
  domain?: string;
  hq?: string;
  teaser?: string;
};

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

/** Fields for home-page cards; omits when nothing meaningful exists. */
export function metaToListExtras(raw: unknown): CompanyListMeta | undefined {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }
  const m = raw as Partial<CompanyMetaProfile>;
  const domain = metaPresent(m.domain);
  const hq = metaPresent(m.hq);
  const offices = formatMajorOffices(m.major_offices);
  const hqLine = [hq, offices].filter(Boolean).join(" · ") || null;
  const core = metaPresent(m.about?.core_products_services);
  let teaser = core ? truncate(core, 160) : undefined;
  const sup = m.file_supplement;
  if (!teaser && sup?.comparative_scale?.metric && sup?.comparative_scale?.value) {
    teaser = truncate(
      `${sup.comparative_scale.metric}: ${sup.comparative_scale.value}`,
      160
    );
  }
  if (!teaser && sup?.comparative_employee?.value) {
    teaser = truncate(sup.comparative_employee.value, 160);
  }
  const excerpt = metaPresent(sup?.executive_summary_excerpt);
  if (!teaser && excerpt) {
    teaser = truncate(excerpt, 160);
  }
  if (!domain && !hqLine && !teaser) return undefined;
  return {
    ...(domain ? { domain } : {}),
    ...(hqLine ? { hq: hqLine } : {}),
    ...(teaser ? { teaser } : {}),
  };
}

export function isCompanyMetaObject(value: unknown): value is CompanyMetaProfile {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const name = (value as { name?: unknown }).name;
  return typeof name === "string" && name.trim().length > 0;
}

export function getValidatedCompanyMeta(
  raw: unknown
): CompanyMetaProfile | null {
  return isCompanyMetaObject(raw) ? raw : null;
}

/** Parse admin JSON: empty → null; object must include non-empty `name`. */
export function parseCompanyMetaJson(raw: string): CompanyMetaProfile | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error("Company profile JSON is not valid JSON.");
  }
  if (parsed === null) return null;
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Company profile must be a JSON object (or empty for none).");
  }
  const name = (parsed as { name?: unknown }).name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error('Company profile JSON must include a non-empty "name" field.');
  }
  return parsed as CompanyMetaProfile;
}

function pushUrls(acc: Set<string>, urls: string[] | undefined): void {
  if (!urls) return;
  for (const u of urls) {
    const t = typeof u === "string" ? u.trim() : "";
    if (t) acc.add(t);
  }
}

/** Deduped citation URLs from nested `source_urls` arrays. */
export function collectMetaSourceUrls(meta: CompanyMetaProfile): string[] {
  const acc = new Set<string>();
  pushUrls(acc, meta.about?.source_urls);
  pushUrls(acc, meta.culture?.source_urls);
  pushUrls(acc, meta.others?.source_urls);
  for (const l of meta.leadership ?? []) {
    const u = l.source_url?.trim();
    if (u) acc.add(u);
  }
  const fs = meta.file_supplement;
  pushUrls(acc, fs?.comparative_employee?.source_urls);
  pushUrls(acc, fs?.comparative_scale?.source_urls);
  return Array.from(acc);
}
