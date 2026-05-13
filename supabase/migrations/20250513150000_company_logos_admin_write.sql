-- Allow admins (is_admin) to upload / replace / delete objects in company-logos

create policy "Admins insert company logos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'company-logos'
    and public.is_admin()
  );

create policy "Admins update company logos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'company-logos'
    and public.is_admin()
  )
  with check (
    bucket_id = 'company-logos'
    and public.is_admin()
  );

create policy "Admins delete company logos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'company-logos'
    and public.is_admin()
  );
