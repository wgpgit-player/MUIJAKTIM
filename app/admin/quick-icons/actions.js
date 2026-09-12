"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { uploadMedia } from "@/lib/uploadMedia";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function readFields(formData) {
  const label = formData.get("label")?.toString().trim();
  const linkUrl = formData.get("linkUrl")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10) || 0;
  const active = formData.get("active") === "on";
  const showOnDesktop = formData.get("showOnDesktop") === "on";
  const showOnMobile = formData.get("showOnMobile") === "on";
  const currentIconUrl = formData.get("currentIconUrl")?.toString().trim() || null;

  const file = formData.get("iconFile");
  let iconUrl = currentIconUrl;
  if (file instanceof File && file.size > 0) {
    iconUrl = await uploadMedia(file, "icons");
  }

  if (!label || !linkUrl || !iconUrl) {
    throw new Error("Label, tautan, dan ikon wajib diisi.");
  }
  return { label, linkUrl, description, iconUrl, sortOrder, active, showOnDesktop, showOnMobile };
}

export async function createQuickIcon(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);
  await prisma.quickIcon.create({ data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/quick-icons");
  revalidatePath("/");
  redirect("/admin/quick-icons");
}

export async function updateQuickIcon(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);
  await prisma.quickIcon.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/quick-icons");
  revalidatePath("/");
  redirect("/admin/quick-icons");
}

export async function deleteQuickIcon(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.quickIcon.delete({ where: { id } });
  revalidatePath("/admin/quick-icons");
  revalidatePath("/");
}
