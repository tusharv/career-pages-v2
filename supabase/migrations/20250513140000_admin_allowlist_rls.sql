-- Admin allowlist and write access for companies / openings (authenticated JWT)

create table if not exists public.admin_allowlist (
  email text primary key
);

alter table public.admin_allowlist enable row level security;

insert into public.admin_allowlist (email)
values ('tusharvaghela@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowlist a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "Admins can insert companies"
  on public.companies
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update companies"
  on public.companies
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete companies"
  on public.companies
  for delete
  to authenticated
  using (public.is_admin());

create policy "Admins can insert openings"
  on public.openings
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update openings"
  on public.openings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete openings"
  on public.openings
  for delete
  to authenticated
  using (public.is_admin());
