-- Restore Supabase's standard schema/table/sequence/function grants for anon,
-- authenticated, and service_role on schema "public". These are normally set up
-- automatically by the Supabase platform, but get lost if schema "public" is ever
-- dropped and recreated (e.g. via `prisma migrate reset`). Actual access control for
-- anon/authenticated still comes from RLS policies (0001_rbac_and_rls.sql) — these
-- grants only restore the baseline Postgres permission to attempt the query at all.
-- service_role bypasses RLS by design and needs these grants to function (e.g. the
-- admin client in lib/supabase/admin.ts, used to promote/deactivate user accounts).

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
