import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import FatwaClient from "./FatwaClient";

export const metadata = { title: "Fiqih & Fatwa — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

const CATEGORY_TO_KEY = {
  IBADAH_KESEHATAN: "ibadah",
  MUAMALAH: "muamalah",
  DIREKTORI_KONTEMPORER: "kontemporer",
};

export default async function FatwaPage() {
  const items = await prisma.fatwa.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const fatwaList = items.map((f) => ({
    number: f.number ?? "",
    category: CATEGORY_TO_KEY[f.category] ?? "kontemporer",
    title: f.title,
    date: formatDateID(f.publishedAt ?? f.createdAt),
    pdfUrl: f.pdfUrl,
  }));

  return <FatwaClient fatwaList={fatwaList} />;
}
