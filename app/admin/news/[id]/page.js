import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewsForm from "@/components/admin/NewsForm";
import { updateNews } from "../actions";

export const metadata = { title: "Edit Berita — Admin MUI Jakarta Timur" };

export default async function EditNewsPage({ params }) {
  const { id } = await params;
  const item = await prisma.news.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Berita</h1>
      <NewsForm action={updateNews.bind(null, id)} initial={item} />
    </div>
  );
}
