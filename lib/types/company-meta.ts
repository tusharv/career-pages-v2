/** One leadership entry (matches `public/company_meta.json` company objects). */
export interface CompanyMetaLeadership {
  name: string;
  title: string;
  source_url?: string;
}

export interface CompanyMetaAbout {
  founding_year?: string;
  employee_count?: string;
  core_products_services?: string;
  source_urls?: string[];
}

export interface CompanyMetaCulture {
  values?: string;
  mission?: string;
  glassdoor_summary?: string;
  linkedin_insights?: string;
  source_urls?: string[];
}

export interface CompanyMetaOthers {
  financials?: string;
  funding?: string;
  major_customers_partners?: string;
  recent_news?: string;
  regulatory_issues?: string;
  patents?: string;
  mna_activity?: string;
  source_urls?: string[];
}

/** Extra fields merged from `public/company_meta.json` (index, methodology, comparative slices). */
export interface CompanyMetaComparativeEmployee {
  value: string;
  metric_as_of?: string;
  source_urls?: string[];
}

export interface CompanyMetaComparativeScale {
  metric: string;
  value: string;
  source_urls?: string[];
}

export interface CompanyMetaFileSupplement {
  from_recovered_name_index?: boolean;
  coverage_note?: string;
  executive_summary_excerpt?: string;
  limitations_excerpt?: string;
  comparative_employee?: CompanyMetaComparativeEmployee;
  comparative_scale?: CompanyMetaComparativeScale;
  /** Cross-metric chart from the source file (may repeat on multiple companies that have comparative rows). */
  comparative_chart_mermaid?: string;
}

/**
 * Full profile object stored in `companies.company_meta` and in each item of
 * `company_meta.json` → `companies`.
 */
export interface CompanyMetaProfile {
  name: string;
  hq?: string;
  major_offices?: string | string[];
  domain?: string;
  website?: string;
  about?: CompanyMetaAbout;
  leadership?: CompanyMetaLeadership[];
  culture?: CompanyMetaCulture;
  others?: CompanyMetaOthers;
  ambiguity_flag?: boolean;
  ambiguity_notes?: string;
  /**
   * Optional: extra normalised name strings used only by `scripts/seed-company-meta.ts` to map
   * `companies[]` full profiles to DB rows (e.g. uploaded list spelling). Strip before persisting to DB.
   */
  seed_match_names?: string[];
  /** Optional: merged during seed from other top-level / metadata sections of the JSON file. */
  file_supplement?: CompanyMetaFileSupplement;
}
