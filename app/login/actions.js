"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * Accepts either an email or a username as the identifier. Usernames are resolved to
 * their email server-side via Prisma (direct DB connection, bypasses RLS safely since
 * this never runs on the client) before calling Supabase's signInWithPassword.
 */
export async function signIn(identifier, password) {
  const isEmail = identifier.includes("@");

  let email = identifier;
  if (!isEmail) {
    const profile = await prisma.profile.findUnique({ where: { username: identifier } });
    if (!profile) {
      return { error: "Username atau kata sandi salah." };
    }
    email = profile.email;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Username/email atau kata sandi salah." };
  }
  return { error: null };
}
