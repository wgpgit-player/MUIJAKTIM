"use server";

import { prisma } from "@/lib/prisma";
import { getAuthedProfile } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

const RATE_LIMIT_MS = 30_000;
const lastPostAt = new Map();

export async function createComment(contentType, contentId, path, formData) {
  const profile = await getAuthedProfile();
  if (!profile) throw new Error("Anda harus login untuk berkomentar.");

  const body = formData.get("body")?.toString().trim();
  if (!body) throw new Error("Komentar tidak boleh kosong.");
  if (body.length > 1000) throw new Error("Komentar terlalu panjang (maks 1000 karakter).");

  const last = lastPostAt.get(profile.id) ?? 0;
  if (Date.now() - last < RATE_LIMIT_MS) {
    throw new Error("Anda terlalu cepat berkomentar lagi, tunggu sebentar.");
  }

  await prisma.comment.create({
    data: { contentType, contentId, authorId: profile.id, body },
  });
  lastPostAt.set(profile.id, Date.now());

  revalidatePath(path);
}

export async function deleteOwnComment(id, path) {
  const profile = await getAuthedProfile();
  if (!profile) throw new Error("Anda harus login.");

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return;
  if (comment.authorId !== profile.id && profile.role === "USER") {
    throw new Error("Anda tidak berhak menghapus komentar ini.");
  }

  await prisma.comment.update({ where: { id }, data: { isDeleted: true, deletedBy: profile.id } });
  revalidatePath(path);
}
