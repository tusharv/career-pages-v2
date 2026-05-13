export interface CompanyRow {
  id: string;
  slug: string;
  name: string;
  careers_url: string;
  blog_url: string | null;
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
}

export interface CompanyWithOpenings extends CompanyRow {
  openings: OpeningRow[];
}
