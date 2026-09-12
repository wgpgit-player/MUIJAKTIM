"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readFields(formData) {
  const imageUrl = formData.get("imageUrl")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const linkUrl = formData.get("linkUrl")?.toString().trim() || null;
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10) || 0;
  const active = formData.get("active") === "on";

  if (!imageUrl || !title) {
    throw new Error("URL gambar dan judul wajib diisi.");
  }
  return { imageUrl, title, linkUrl, sortOrder, active };
}

export async function createHeroSlide(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);
  await prisma.heroSlide.create({ data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/hero-slide");
  revalidatePath("/");
  redirect("/admin/hero-slide");
}

export async function updateHeroSlide(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);
  await prisma.heroSlide.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/hero-slide");
  revalidatePath("/");
  redirect("/admin/hero-slide");
}

export async function deleteHeroSlide(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/admin/hero-slide");
  revalidatePath("/");
}
