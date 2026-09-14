import { cache } from "react";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

export type SitemapCompanyRow = {
  slug: string;
  updated_at: string | null;
};

export const getSitemapCompanies = cache(
  async (): Promise<SitemapCompanyRow[]> => {
    const supabase = createSupabaseAnonServerClient();
    const { data, error } = await supabase
      .from("companies")
      .select("slug, updated_at")
      .order("slug", { ascending: true });

    if (error) {
      console.error("sitemap companies:", error.message);
      return [];
    }

    return (data ?? []) as SitemapCompanyRow[];
  }
);
