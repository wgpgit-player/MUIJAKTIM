// Free, no-API "Tanya AI": keyword search over admin-uploaded documents (see
// lib/searchKnowledge.js). Returns the best-matching excerpt, or a clear "not found"
// message telling the visitor to use "Chat Admin" instead — per the agreed design.
import { prisma } from "@/lib/prisma";
import { searchKnowledge } from "@/lib/searchKnowledge";

const NOT_FOUND_MESSAGE = "Saya tidak dapat menemukan jawaban, silahkan chat dengan admin.";
const MIN_SCORE = 0.15;
const MIN_RAW_SCORE = 1;

export async function POST(request) {
  try {
    const { question } = await request.json();
    if (!question || typeof question !== "string" || !question.trim()) {
      return Response.json({ ok: false, answer: NOT_FOUND_MESSAGE, found: false }, { status: 400 });
    }

    const chunks = await prisma.knowledgeChunk.findMany({
      where: { document: { status: "READY" } },
      include: { document: { select: { title: true } } },
      take: 2000,
    });

    if (chunks.length === 0) {
      return Response.json({ ok: true, answer: NOT_FOUND_MESSAGE, found: false });
    }

    const results = searchKnowledge(question, chunks);
    const best = results[0];

    if (!best || best.score < MIN_SCORE || best.rawScore < MIN_RAW_SCORE) {
      return Response.json({ ok: true, answer: NOT_FOUND_MESSAGE, found: false });
    }

    return Response.json({
      ok: true,
      found: true,
      answer: best.chunk.content,
      source: best.chunk.document.title,
    });
  } catch (err) {
    return Response.json({ ok: false, answer: NOT_FOUND_MESSAGE, found: false, error: String(err) }, { status: 200 });
  }
}
