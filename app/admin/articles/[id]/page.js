import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";
import { updateArticle } from "../actions";

export const metadata = { title: "Edit Artikel — Admin MUI Jakarta Timur" };

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  const item = await prisma.article.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Artikel</h1>
      <ArticleForm action={updateArticle.bind(null, id)} initial={item} />
    </div>
  );
}
