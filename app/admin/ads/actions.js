"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { uploadMedia } from "@/lib/uploadMedia";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function readFields(formData) {
  const placement = formData.get("placement")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const linkUrl = formData.get("linkUrl")?.toString().trim();
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10) || 0;
  const active = formData.get("active") === "on";
  const startAtRaw = formData.get("startAt")?.toString().trim();
  const endAtRaw = formData.get("endAt")?.toString().trim();
  const currentImageUrl = formData.get("currentImageUrl")?.toString().trim() || null;

  const file = formData.get("imageFile");
  let imageUrl = currentImageUrl;
  if (file instanceof File && file.size > 0) {
    imageUrl = await uploadMedia(file, "ads");
  }

  if (!placement || !title || !linkUrl || !imageUrl) {
    throw new Error("Slot, judul, tautan, dan gambar wajib diisi.");
  }

  const startAt = startAtRaw ? new Date(startAtRaw) : null;
  const endAt = endAtRaw ? new Date(endAtRaw) : null;
  if (startAt && endAt && startAt > endAt) {
    throw new Error("Tanggal mulai tidak boleh setelah tanggal selesai.");
  }

  return { placement, title, linkUrl, imageUrl, sortOrder, active, startAt, endAt };
}

export async function createAd(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);
  await prisma.advertisement.create({ data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/ads");
  revalidatePath("/");
  redirect("/admin/ads");
}

export async function updateAd(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);
  await prisma.advertisement.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/ads");
  revalidatePath("/");
  redirect("/admin/ads");
}

export async function deleteAd(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.advertisement.delete({ where: { id } });
  revalidatePath("/admin/ads");
  revalidatePath("/");
}
