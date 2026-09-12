"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { uploadMedia } from "@/lib/uploadMedia";
import { chunkText } from "@/lib/chunkText";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function extractText(file) {
  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".md") || name.endsWith(".txt")) {
    return { text: buffer.toString("utf-8"), fileType: "md" };
  }
  if (name.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return { text: result.text, fileType: "pdf" };
  }
  throw new Error("Format file tidak didukung. Gunakan .md, .txt, atau .pdf.");
}

export async function createKnowledgeDocument(formData) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const title = formData.get("title")?.toString().trim();
  const file = formData.get("file");

  if (!title || !(file instanceof File) || file.size === 0) {
    throw new Error("Judul dan file wajib diisi.");
  }

  const fileUrl = await uploadMedia(file, "knowledge");

  const doc = await prisma.knowledgeDocument.create({
    data: { title, fileUrl, fileType: "pending", status: "PROCESSING", uploadedBy: profile.id },
  });

  try {
    const { text, fileType } = await extractText(file);
    const chunks = chunkText(text);

    if (chunks.length === 0) {
      throw new Error("Tidak ada teks yang bisa diambil dari file ini.");
    }

    await prisma.$transaction([
      prisma.knowledgeDocument.update({
        where: { id: doc.id },
        data: { fileType, status: "READY" },
      }),
      prisma.knowledgeChunk.createMany({
        data: chunks.map((content, i) => ({ documentId: doc.id, content, sortOrder: i })),
      }),
    ]);
  } catch (err) {
    await prisma.knowledgeDocument.update({
      where: { id: doc.id },
      data: { status: "ERROR", errorMessage: String(err?.message ?? err) },
    });
  }

  revalidatePath("/admin/knowledge");
  redirect("/admin/knowledge");
}

export async function deleteKnowledgeDocument(id) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.knowledgeDocument.delete({ where: { id } });
  revalidatePath("/admin/knowledge");
}
