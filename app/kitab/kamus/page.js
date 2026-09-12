import ArticleListPage from "@/components/articles/ArticleListPage";

export const metadata = { title: "Kamus Istilah — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ArticleListPage
      eyebrow="Kitab & Referensi"
      title="Kamus Istilah"
      description="Penjelasan istilah-istilah keislaman yang sering dijumpai."
      section="KITAB_KAMUS"
      basePath="/kitab/kamus"
    />
  );
}
