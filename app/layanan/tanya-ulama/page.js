import { prisma } from "@/lib/prisma";
import TanyaUlamaClient from "./TanyaUlamaClient";

export const metadata = { title: "Tanya Ulama — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default async function TanyaUlamaPage() {
  const items = await prisma.faqTanyaUlama.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });

  const faqList = items.map((f) => ({
    q: f.question,
    a: f.answer,
    keywords: Array.isArray(f.keywords) ? f.keywords : [],
  }));

  return <TanyaUlamaClient faqList={faqList} />;
}
