import type { CompanyListMeta } from "@/lib/company-meta";
import type { CompanyMetaProfile } from "@/lib/types/company-meta";

export interface CompanyRow {
  id: string;
  slug: string;
  name: string;
  careers_url: string;
  blog_url: string | null;
  /** Same shape as entries in `public/company_meta.json` → `companies`. Omitted when not selected. */
  company_meta?: CompanyMetaProfile | null;
}

export interface OpeningRow {
  id: string;
  company_id: string;
  title: string | null;
  url: string;
  sort_order: number;
}

/** Shape returned by GET /api/companies and consumed by the home page / context */
export interface CompanyListItem {
  id: string;
  slug: string;
  name: string;
  url: string;
  blog?: string;
  /** Derived from `company_meta` for directory cards. */
  meta?: CompanyListMeta;
}

export interface CompanyWithOpenings extends CompanyRow {
  openings: OpeningRow[];
}

/** Paginated list from GET /api/companies or POST /api/companies (saved) */
export interface CompaniesPageResponse {
  data: CompanyListItem[];
  total: number;
  page: number;
  pageSize: number;
  /** Total rows in `companies` (unfiltered); for hero / “in index” copy */
  indexTotal: number;
}
