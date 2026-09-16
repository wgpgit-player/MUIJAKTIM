"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { uploadMedia } from "@/lib/uploadMedia";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sanitizeBody(html) {
  return DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "ul", "ol", "li",
      "blockquote", "a", "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target", "rel"],
  });
}

function isBodyEmpty(html) {
  return html.replace(/<[^>]+>/g, "").trim().length === 0;
}

async function readFields(formData) {
  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const section = formData.get("section")?.toString();
  const excerpt = formData.get("excerpt")?.toString().trim();
  const body = sanitizeBody(formData.get("body")?.toString().trim());
  const status = formData.get("status")?.toString() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const featured = formData.get("featured") === "on";
  const currentImageUrl = formData.get("currentImageUrl")?.toString().trim() || null;

  if (
    !title ||
    !category ||
    !excerpt ||
    isBodyEmpty(body) ||
    !["KABAR_JAKARTA_TIMUR", "OPINI_ULAMA", "RILIS_PERS"].includes(section)
  ) {
    throw new Error("Semua field wajib diisi dengan benar.");
  }

  let imageUrl = currentImageUrl;
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    imageUrl = await uploadMedia(file, "news");
  }

  return { title, category, section, excerpt, body, status, featured, imageUrl };
}

export async function createNews(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);

  let slug = slugify(fields.title);
  const existing = await prisma.news.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.news.create({
    data: {
      slug,
      ...fields,
      publishedAt: fields.status === "PUBLISHED" ? new Date() : null,
      updatedBy: profile.id,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/berita");
  redirect("/admin/news");
}

export async function updateNews(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = await readFields(formData);

  const current = await prisma.news.findUnique({ where: { id } });
  if (!current) throw new Error("Berita tidak ditemukan.");

  await prisma.news.update({
    where: { id },
    data: {
      ...fields,
      publishedAt: fields.status === "PUBLISHED" ? current.publishedAt ?? new Date() : null,
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
