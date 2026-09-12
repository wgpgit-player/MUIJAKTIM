"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function updateUserRole(targetId, role) {
  const requester = await requireRole(["SUPER_ADMIN"]);

  if (targetId === requester.id) {
    throw new Error("Tidak bisa mengubah role sendiri.");
  }
  if (!["USER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new Error("Role tidak valid.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", targetId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}

export async function setUserActive(targetId, isActive) {
  const requester = await requireRole(["SUPER_ADMIN"]);
  if (targetId === requester.id) {
    throw new Error("Tidak bisa menonaktifkan akun sendiri.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", targetId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}
