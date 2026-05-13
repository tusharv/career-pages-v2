import { NextResponse } from "next/server";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import type { CompanyListItem, CompanyRow, OpeningRow } from "@/lib/types/company";

export const revalidate = 3600;

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
    const supabase = createSupabaseAnonServerClient();

    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id, slug, name, careers_url, blog_url")
      .order("name", { ascending: true });

    if (companiesError) {
      console.error(companiesError);
      return NextResponse.json(
        { error: companiesError.message },
        { status: 500 }
      );
    }

    if (!includeOpenings) {
      const list: CompanyListItem[] = (companies ?? []).map((c) =>
        rowToListItem(c as CompanyRow)
      );
      return NextResponse.json(list);
    }

    const { data: openings, error: openingsError } = await supabase
      .from("openings")
      .select("id, company_id, title, url, sort_order")
      .order("sort_order", { ascending: true });

    if (openingsError) {
      console.error(openingsError);
      return NextResponse.json(
        { error: openingsError.message },
        { status: 500 }
      );
    }

    const byCompany = new Map<string, OpeningRow[]>();
    for (const o of openings ?? []) {
      const row = o as OpeningRow;
      const list = byCompany.get(row.company_id) ?? [];
      list.push(row);
      byCompany.set(row.company_id, list);
    }

    const withOpenings = (companies ?? []).map((c) => {
      const row = c as CompanyRow;
      return {
        ...rowToListItem(row),
        openings: byCompany.get(row.id) ?? [],
      };
    });

    return NextResponse.json(withOpenings);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
