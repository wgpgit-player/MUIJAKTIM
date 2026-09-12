import ArticleForm from "@/components/admin/ArticleForm";
import { createArticle } from "../actions";

export const metadata = { title: "Artikel Baru — Admin MUI Jakarta Timur" };

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Artikel Baru</h1>
      <ArticleForm action={createArticle} />
    </div>
  );
}
