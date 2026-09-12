"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readFields(formData) {
  const name = formData.get("name")?.toString().trim();
  const position = formData.get("position")?.toString().trim();
  const photoUrl = formData.get("photoUrl")?.toString().trim() || null;
  const period = formData.get("period")?.toString().trim();
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10) || 0;

  if (!name || !position || !period) {
    throw new Error("Nama, jabatan, dan periode wajib diisi.");
  }
  return { name, position, photoUrl, period, sortOrder };
}

export async function createPengurus(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);
  await prisma.pengurus.create({ data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/pengurus");
  revalidatePath("/profil/pengurus");
  redirect("/admin/pengurus");
}

export async function updatePengurus(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);
  await prisma.pengurus.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/pengurus");
  revalidatePath("/profil/pengurus");
  redirect("/admin/pengurus");
}

export async function deletePengurus(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.pengurus.delete({ where: { id } });
  revalidatePath("/admin/pengurus");
  revalidatePath("/profil/pengurus");
}
