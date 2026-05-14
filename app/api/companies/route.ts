import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import type {
  CompanyListItem,
  CompanyRow,
  CompaniesPageResponse,
} from "@/lib/types/company";

const CACHE_TTL_SECONDS = 3600;

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
};

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 12;
const MAX_SEARCH_LEN = 160;

function escapeIlike(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function rowToListItem(row: CompanyRow): CompanyListItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    url: row.careers_url,
    ...(row.blog_url ? { blog: row.blog_url } : {}),
  };
}

const getCompanyIndexTotal = unstable_cache(
  async (): Promise<number> => {
    const supabase = createSupabaseAnonServerClient();
    const { count, error } = await supabase
      .from("companies")
      .select("id", { count: "exact", head: true });
    if (error) {
      throw new Error(error.message);
    }
    return count ?? 0;
  },
  ["companies:index-total"],
  { revalidate: CACHE_TTL_SECONDS, tags: ["companies"] }
);

const getCompaniesPage = unstable_cache(
  async (
    page: number,
    pageSize: number,
    search: string
  ): Promise<{ rows: CompanyRow[]; total: number }> => {
    const supabase = createSupabaseAnonServerClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("companies")
      .select("id, slug, name, careers_url, blog_url", { count: "exact" })
      .order("name", { ascending: true });

    const trimmed = search.slice(0, MAX_SEARCH_LEN).trim();
    if (trimmed) {
      query = query.ilike("name", `%${escapeIlike(trimmed)}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
      throw new Error(error.message);
    }
    return { rows: (data ?? []) as CompanyRow[], total: count ?? 0 };
  },
  ["companies-paged"],
  { revalidate: CACHE_TTL_SECONDS, tags: ["companies"] }
);

function parsePageParams(searchParams: URLSearchParams): {
  page: number;
  pageSize: number;
  q: string;
} {
  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const rawLimit = Number.parseInt(
    searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE),
    10
  );
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const pageSizeRaw =
    Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(MAX_PAGE_SIZE, pageSizeRaw);
  const q = (searchParams.get("q") ?? "").slice(0, MAX_SEARCH_LEN);
  return { page, pageSize, q };
}

/** GET ?page=&limit=&q= — paginated directory (default list for the home page). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { page, pageSize, q } = parsePageParams(searchParams);

  try {
    const [{ rows, total }, indexTotal] = await Promise.all([
      getCompaniesPage(page, pageSize, q),
      getCompanyIndexTotal(),
    ]);

    const data: CompanyListItem[] = rows.map(rowToListItem);

    const body: CompaniesPageResponse = {
      data,
      total,
      page,
      pageSize,
      indexTotal,
    };

    return NextResponse.json(body, { headers: CACHE_HEADERS });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type MigrateBody = { kind: "migrate"; keys: string[] };
type SavedBody = {
  kind: "saved";
  page: number;
  pageSize: number;
  keys: string[];
};

type PostBody = MigrateBody | SavedBody;

function isMigrateBody(b: PostBody): b is MigrateBody {
  return b?.kind === "migrate" && Array.isArray(b.keys);
}

function isSavedBody(b: PostBody): b is SavedBody {
  return (
    b?.kind === "saved" &&
    Array.isArray(b.keys) &&
    b.page != null &&
    b.pageSize != null
  );
}

async function handleMigrate(keys: string[]): Promise<{ keys: string[] }> {
  const stored = Array.from(
    new Set(keys.filter((k) => typeof k === "string" && k))
  );
  const legacyIds = stored.filter((k) => !/^https?:\/\//i.test(k));
  const migratedSet = new Set<string>();

  for (const v of stored) {
    if (/^https?:\/\//i.test(v)) {
      migratedSet.add(v);
    }
  }

  if (legacyIds.length === 0) {
    return { keys: Array.from(migratedSet) };
  }

  const supabase = createSupabaseAnonServerClient();
  const { data, error } = await supabase
    .from("companies")
    .select("id, careers_url")
    .in("id", legacyIds);
  if (error) {
    throw new Error(error.message);
  }
  const idToUrl = new Map(
    (data ?? []).map((r: { id: string; careers_url: string }) => [
      String(r.id),
      r.careers_url,
    ])
  );

  for (const v of stored) {
    if (/^https?:\/\//i.test(v)) continue;
    const mapped = idToUrl.get(String(v));
    if (mapped) migratedSet.add(mapped);
  }

  return { keys: Array.from(migratedSet) };
}

async function handleSavedPage(
  keys: string[],
  page: number,
  pageSize: number
): Promise<CompaniesPageResponse> {
  const indexTotal = await getCompanyIndexTotal();
  const uniqueKeys = Array.from(
    new Set(keys.filter((k) => typeof k === "string" && k.length > 0))
  );
  if (uniqueKeys.length === 0) {
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      indexTotal,
    };
  }

  const urls = uniqueKeys.filter((k) => /^https?:\/\//i.test(k));
  const rawIds = uniqueKeys.filter((k) => !/^https?:\/\//i.test(k));

  const supabase = createSupabaseAnonServerClient();
  const rowsAcc: CompanyRow[] = [];

  if (urls.length > 0) {
    const { data, error } = await supabase
      .from("companies")
      .select("id, slug, name, careers_url, blog_url")
      .in("careers_url", urls);
    if (error) {
      throw new Error(error.message);
    }
    rowsAcc.push(...((data ?? []) as CompanyRow[]));
  }
  if (rawIds.length > 0) {
    const { data, error } = await supabase
      .from("companies")
      .select("id, slug, name, careers_url, blog_url")
      .in("id", rawIds);
    if (error) {
      throw new Error(error.message);
    }
    rowsAcc.push(...((data ?? []) as CompanyRow[]));
  }

  const byId = new Map(rowsAcc.map((r) => [r.id, r]));
  const sorted = Array.from(byId.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const total = sorted.length;
  const from = (page - 1) * pageSize;
  const slice = sorted.slice(from, from + pageSize);

  return {
    data: slice.map(rowToListItem),
    total,
    page,
    pageSize,
    indexTotal,
  };
}

/** POST JSON: `{ kind: "migrate", keys }` or `{ kind: "saved", page, pageSize, keys }` */
export async function POST(request: Request) {
  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    if (isMigrateBody(body)) {
      const result = await handleMigrate(body.keys);
      return NextResponse.json(result);
    }
    if (isSavedBody(body)) {
      const page = Math.max(1, Math.floor(Number(body.page)) || 1);
      const pageSize = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, Math.floor(Number(body.pageSize)) || DEFAULT_PAGE_SIZE)
      );
      const result = await handleSavedPage(body.keys, page, pageSize);
      return NextResponse.json(result);
    }
    return NextResponse.json(
      {
        error:
          'Expected body { kind: "migrate", keys: string[] } or { kind: "saved", page, pageSize, keys: string[] }',
      },
      { status: 400 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
