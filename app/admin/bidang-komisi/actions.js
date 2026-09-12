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
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const chairName = formData.get("chairName")?.toString().trim() || null;
  const membersRaw = formData.get("members")?.toString().trim() || "[]";

  if (!name || !description) {
    throw new Error("Nama dan deskripsi wajib diisi.");
  }

  let members;
  try {
    members = JSON.parse(membersRaw);
    if (!Array.isArray(members)) throw new Error();
  } catch {
    throw new Error('Anggota harus berupa JSON array, mis. ["Nama A", "Nama B"].');
  }

  return { name, description, chairName, members };
}

export async function createBidangKomisi(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);

  let slug = slugify(fields.name);
  const existing = await prisma.bidangKomisi.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.bidangKomisi.create({ data: { ...fields, slug, updatedBy: profile.id } });
  revalidatePath("/admin/bidang-komisi");
  revalidatePath("/profil/komisi");
  redirect("/admin/bidang-komisi");
}

export async function updateBidangKomisi(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);
  await prisma.bidangKomisi.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/bidang-komisi");
  revalidatePath("/profil/komisi");
  redirect("/admin/bidang-komisi");
}

export async function deleteBidangKomisi(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.bidangKomisi.delete({ where: { id } });
  revalidatePath("/admin/bidang-komisi");
  revalidatePath("/profil/komisi");
}
