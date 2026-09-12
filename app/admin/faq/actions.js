"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function readFields(formData) {
  const question = formData.get("question")?.toString().trim();
  const answer = formData.get("answer")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0", 10) || 0;
  const status = formData.get("status")?.toString() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  if (!question || !answer || !category) {
    throw new Error("Semua field wajib diisi.");
  }
  return { question, answer, category, sortOrder, status };
}

export async function createFaq(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);
  await prisma.faqTanyaUlama.create({ data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/faq");
  revalidatePath("/layanan/tanya-ulama");
  redirect("/admin/faq");
}

export async function updateFaq(id, formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const fields = readFields(formData);
  await prisma.faqTanyaUlama.update({ where: { id }, data: { ...fields, updatedBy: profile.id } });
  revalidatePath("/admin/faq");
  revalidatePath("/layanan/tanya-ulama");
  redirect("/admin/faq");
}

export async function deleteFaq(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.faqTanyaUlama.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/layanan/tanya-ulama");
}
