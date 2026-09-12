import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/// Service-role client — bypasses RLS entirely. Server-only (never import from a
/// Client Component). Use only for privileged operations (e.g. super admin changing
/// another user's role) where RLS policies intentionally don't allow the action.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
