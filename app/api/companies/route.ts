import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import type { CompanyListItem, CompanyRow, OpeningRow } from "@/lib/types/company";

const CACHE_TTL_SECONDS = 3600;

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
};

const getCompanies = unstable_cache(
  async (): Promise<CompanyRow[]> => {
    const supabase = createSupabaseAnonServerClient();
    const { data, error } = await supabase
      .from("companies")
      .select("id, slug, name, careers_url, blog_url")
      .order("name", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as CompanyRow[];
  },
  ["companies:list"],
  { revalidate: CACHE_TTL_SECONDS, tags: ["companies"] }
);

const getOpenings = unstable_cache(
  async (): Promise<OpeningRow[]> => {
    const supabase = createSupabaseAnonServerClient();
    const { data, error } = await supabase
      .from("openings")
      .select("id, company_id, title, url, sort_order")
      .order("sort_order", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as OpeningRow[];
  },
  ["openings:list"],
  { revalidate: CACHE_TTL_SECONDS, tags: ["openings"] }
);

function rowToListItem(row: CompanyRow): CompanyListItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    url: row.careers_url,
    ...(row.blog_url ? { blog: row.blog_url } : {}),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeOpenings = searchParams.get("include") === "openings";

  try {
    const companies = await getCompanies();

    if (!includeOpenings) {
      const list: CompanyListItem[] = companies.map(rowToListItem);
      return NextResponse.json(list, { headers: CACHE_HEADERS });
    }

    const openings = await getOpenings();

    const byCompany = new Map<string, OpeningRow[]>();
    for (const row of openings) {
      const list = byCompany.get(row.company_id) ?? [];
      list.push(row);
      byCompany.set(row.company_id, list);
    }

    const withOpenings = companies.map((row) => ({
      ...rowToListItem(row),
      openings: byCompany.get(row.id) ?? [],
    }));

    return NextResponse.json(withOpenings, { headers: CACHE_HEADERS });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
