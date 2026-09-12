// One-off script to bootstrap the first SUPER_ADMIN account.
// Usage: npx tsx scripts/create-super-admin.ts <username> <password> [email]
// If [email] is omitted, defaults to "<username>@muijaktim.or.id" (Supabase Auth
// requires an email even though login also works via username — see app/login/actions.js).
// Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the environment.
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Next.js loads .env then overlays .env.local automatically; plain `dotenv` does not,
// so load both explicitly (same pattern needed in prisma/seed.ts).
config({ path: ".env" });
config({ path: ".env.local", override: true });

async function main() {
  const [username, password, emailArg] = process.argv.slice(2);
  if (!username || !password) {
    console.error("Usage: npx tsx scripts/create-super-admin.ts <username> <password> [email]");
    process.exit(1);
  }
  const email = emailArg || `${username.toLowerCase()}@muijaktim.or.id`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, first_name: "Super", last_name: "Admin" },
  });

  if (createError) {
    console.error("Gagal membuat user:", createError.message);
    process.exit(1);
  }

  // The on_auth_user_created trigger (supabase/migrations/0001_rbac_and_rls.sql)
  // already inserted a profiles row with role USER — promote it to SUPER_ADMIN.
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: "SUPER_ADMIN" })
    .eq("id", created.user.id);

  if (updateError) {
    console.error("User dibuat tapi gagal set role SUPER_ADMIN:", updateError.message);
    process.exit(1);
  }

  console.log(`Super admin dibuat: ${email} (username: ${username}), role: SUPER_ADMIN`);
}

main();
