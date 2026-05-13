-- Companies catalog and per-company opening links (read-only for anonymous users via RLS)

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  careers_url text not null,
  blog_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_name_idx on public.companies (name);

create table if not exists public.openings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists openings_company_id_idx on public.openings (company_id);
create index if not exists openings_company_sort_idx on public.openings (company_id, sort_order);

alter table public.companies enable row level security;
alter table public.openings enable row level security;

create policy "Allow public read access to companies"
  on public.companies
  for select
  to anon, authenticated
  using (true);

create policy "Allow public read access to openings"
  on public.openings
  for select
  to anon, authenticated
  using (true);

-- Optional: keep updated_at in sync (trigger pattern)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
  before update on public.companies
  for each row
  execute function public.set_updated_at();
