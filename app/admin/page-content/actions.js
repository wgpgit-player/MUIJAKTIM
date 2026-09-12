"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePageContent(key, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const title = formData.get("title")?.toString().trim();
  const body = formData.get("body")?.toString().trim();

  if (!title || !body) {
    throw new Error("Judul dan isi wajib diisi.");
  }

  await prisma.pageContent.update({ where: { key }, data: { title, body, updatedBy: profile.id } });

  revalidatePath("/admin/page-content");
  revalidatePath("/profil");
  revalidatePath("/keluarga/konsultasi");
  redirect("/admin/page-content");
}
