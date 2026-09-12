import { createClient } from "@/lib/supabase/server";

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export type AuthedProfile = {
  id: string;
  role: Role;
  isActive: boolean;
};

/** Reads the current session + profile.role from the DB (never trusts the client). */
export async function getAuthedProfile(): Promise<AuthedProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { id: user.id, role: profile.role, isActive: profile.is_active };
}

/** Throws a plain Error (caught by the route/action caller) if the role requirement isn't met. */
export async function requireRole(allowed: Role[]): Promise<AuthedProfile> {
  const profile = await getAuthedProfile();
  if (!profile || !profile.isActive) {
    throw new Error("UNAUTHENTICATED");
  }
  if (!allowed.includes(profile.role)) {
    throw new Error("FORBIDDEN");
  }
  return profile;
}
