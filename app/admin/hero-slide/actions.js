"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { uploadMedia } from "@/lib/uploadMedia";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function readFields(formData) {
  const title = formData.get("title")?.toString().trim();
  const linkUrl = formData.get("linkUrl")?.toString().trim() || null;
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10) || 0;
  const active = formData.get("active") === "on";
  const currentImageUrl = formData.get("currentImageUrl")?.toString().trim() || null;

  const file = formData.get("imageFile");
  let imageUrl = currentImageUrl;
  if (file instanceof File && file.size > 0) {
    imageUrl = await uploadMedia(file, "hero");
  }

  if (!imageUrl || !title) {
    throw new Error("Gambar dan judul wajib diisi.");
  }
  return { imageUrl, title, linkUrl, sortOrder, active };
}

export async function createHeroSlide(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);
  await prisma.heroSlide.create({ data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/hero-slide");
  revalidatePath("/");
  redirect("/admin/hero-slide");
}

export async function updateHeroSlide(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);
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
