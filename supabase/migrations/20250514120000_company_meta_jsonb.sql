-- Optional structured company profile (same JSON shape as public/company_meta.json entries)

alter table public.companies
  add column if not exists company_meta jsonb;

comment on column public.companies.company_meta is
  'Company profile JSON: hq, domain, website, about, leadership, culture, others (see company_meta.json).';
