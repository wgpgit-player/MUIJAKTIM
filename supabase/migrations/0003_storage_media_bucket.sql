-- Public "media" bucket for images managed from the admin panel (hero slides, news
-- images, pengurus photos, etc). Public read (so <img>/next/image can load them
-- directly), write restricted to ADMIN/SUPER_ADMIN via the same is_admin() helper
-- used by the content-table RLS policies (0001_rbac_and_rls.sql).

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public reads media bucket" on storage.objects
  for select using (bucket_id = 'media');

create policy "admin uploads to media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and is_admin());

create policy "admin updates media bucket" on storage.objects
  for update using (bucket_id = 'media' and is_admin());

create policy "admin deletes from media bucket" on storage.objects
  for delete using (bucket_id = 'media' and is_admin());
