import { cache } from "react";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import type { CompanyRow, OpeningRow } from "@/lib/types/company";

export type CompanyPageData = {
  company: CompanyRow;
  openings: OpeningRow[];
};

export const getCompanyPageData = cache(
  async (slug: string): Promise<CompanyPageData | null> => {
    const supabase = createSupabaseAnonServerClient();

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, slug, name, careers_url, blog_url")
      .eq("slug", slug)
      .maybeSingle();

    if (companyError || !company) {
      return null;
    }

    const row = company as CompanyRow;

    const { data: openings, error: openingsError } = await supabase
      .from("openings")
      .select("id, company_id, title, url, sort_order")
      .eq("company_id", row.id)
      .order("sort_order", { ascending: true });

    if (openingsError) {
      console.error(openingsError);
    }

    return {
      company: row,
      openings: (openings ?? []) as OpeningRow[],
    };
  }
);
