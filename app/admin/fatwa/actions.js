"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readFields(formData) {
  const title = formData.get("title")?.toString().trim();
  const number = formData.get("number")?.toString().trim() || null;
  const category = formData.get("category")?.toString();
  const body = formData.get("body")?.toString().trim();
  const status = formData.get("status")?.toString() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  if (!title || !body || !["MUAMALAH", "IBADAH_KESEHATAN", "DIREKTORI_KONTEMPORER"].includes(category)) {
    throw new Error("Semua field wajib diisi dengan benar.");
  }
  return { title, number, category, body, status };
}

export async function createFatwa(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);

  let slug = slugify(fields.title);
  const existing = await prisma.fatwa.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.fatwa.create({ data: { ...fields, slug, updatedBy: profile.id } });

  revalidatePath("/admin/fatwa");
  revalidatePath("/fatwa");
  redirect("/admin/fatwa");
}

export async function updateFatwa(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);

  await prisma.fatwa.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });

  revalidatePath("/admin/fatwa");
  revalidatePath("/fatwa");
  redirect("/admin/fatwa");
}

export async function deleteFatwa(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.fatwa.delete({ where: { id } });
  revalidatePath("/admin/fatwa");
  revalidatePath("/fatwa");
}
