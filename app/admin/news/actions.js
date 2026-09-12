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

export async function createNews(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const section = formData.get("section")?.toString();
  const excerpt = formData.get("excerpt")?.toString().trim();
  const body = formData.get("body")?.toString().trim();
  const status = formData.get("status")?.toString() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const featured = formData.get("featured") === "on";

  if (
    !title ||
    !category ||
    !excerpt ||
    !body ||
    !["KABAR_JAKARTA_TIMUR", "OPINI_ULAMA", "RILIS_PERS"].includes(section)
  ) {
    throw new Error("Semua field wajib diisi dengan benar.");
  }

  let slug = slugify(title);
  const existing = await prisma.news.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.news.create({
    data: {
      slug,
      title,
      category,
      section,
      excerpt,
      body,
      featured,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      updatedBy: profile.id,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/berita");
  redirect("/admin/news");
}

export async function updateNews(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const section = formData.get("section")?.toString();
  const excerpt = formData.get("excerpt")?.toString().trim();
  const body = formData.get("body")?.toString().trim();
  const status = formData.get("status")?.toString() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const featured = formData.get("featured") === "on";

  if (
    !title ||
    !category ||
    !excerpt ||
    !body ||
    !["KABAR_JAKARTA_TIMUR", "OPINI_ULAMA", "RILIS_PERS"].includes(section)
  ) {
    throw new Error("Semua field wajib diisi dengan benar.");
  }

  const current = await prisma.news.findUnique({ where: { id } });
  if (!current) throw new Error("Berita tidak ditemukan.");

  await prisma.news.update({
    where: { id },
    data: {
      title,
      category,
      section,
      excerpt,
      body,
      featured,
      status,
      publishedAt: status === "PUBLISHED" ? current.publishedAt ?? new Date() : null,
      updatedBy: profile.id,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/berita");
  redirect("/admin/news");
}

export async function deleteNews(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.news.delete({ where: { id } });
  revalidatePath("/admin/news");
  revalidatePath("/berita");
}
