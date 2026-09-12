-- Knowledge base for the free "Tanya AI" chat widget. Chunks need to be readable by
-- anon (the widget's search endpoint runs with the visitor's own session, which is
-- often anonymous) so the search works for logged-out visitors too; only admins can
-- write. Document rows are admin-only both ways (visitors never need the raw list).

alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;

create policy "admin manages knowledge_documents" on public.knowledge_documents
  for all using (is_admin()) with check (is_admin());

create policy "anyone reads knowledge_chunks" on public.knowledge_chunks
  for select using (true);

create policy "admin writes knowledge_chunks" on public.knowledge_chunks
  for all using (is_admin()) with check (is_admin());
