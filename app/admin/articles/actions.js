"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SECTIONS = [
  "DOA_DZIKIR",
  "HIKMAH_AKHLAK",
  "KHUTBAH_JUMAT",
  "FIQIH_WANITA",
  "PARENTING",
  "KITAB_KAMUS",
  "KITAB_TURATS",
];

const SECTION_PATH = {
  DOA_DZIKIR: "/amalan/doa-dzikir",
  HIKMAH_AKHLAK: "/amalan/hikmah-akhlak",
  KHUTBAH_JUMAT: "/amalan/khutbah-jumat",
  FIQIH_WANITA: "/keluarga/fiqih-wanita",
  PARENTING: "/keluarga/parenting",
  KITAB_KAMUS: "/kitab/kamus",
  KITAB_TURATS: "/kitab/turats",
};

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readFields(formData) {
  const section = formData.get("section")?.toString();
  const title = formData.get("title")?.toString().trim();
  const excerpt = formData.get("excerpt")?.toString().trim() || null;
  const body = formData.get("body")?.toString().trim();
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10) || 0;
  const status = formData.get("status")?.toString() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const extraRaw = formData.get("extra")?.toString().trim() || "{}";

  if (!title || !body || !SECTIONS.includes(section)) {
    throw new Error("Semua field wajib diisi dengan benar.");
  }

  let extra;
  try {
    extra = JSON.parse(extraRaw);
  } catch {
    throw new Error("Field tambahan (extra) harus berupa JSON valid, mis. {}.");
  }

  return { section, title, excerpt, body, sortOrder, status, extra };
}

export async function createArticle(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);

  let slug = slugify(fields.title);
  const existing = await prisma.article.findUnique({
    where: { section_slug: { section: fields.section, slug } },
  });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.article.create({ data: { ...fields, slug, updatedBy: profile.id } });

  revalidatePath("/admin/articles");
  revalidatePath(SECTION_PATH[fields.section]);
  redirect("/admin/articles");
}

export async function updateArticle(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);

  await prisma.article.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });

  revalidatePath("/admin/articles");
  revalidatePath(SECTION_PATH[fields.section]);
  redirect("/admin/articles");
}

export async function deleteArticle(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const item = await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath(SECTION_PATH[item.section]);
}
