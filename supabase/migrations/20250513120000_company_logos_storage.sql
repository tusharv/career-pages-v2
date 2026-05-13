-- Public storage bucket for company logos (object key: {careers_hostname}.webp)

insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read company logos" on storage.objects;

create policy "Public read company logos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'company-logos');
