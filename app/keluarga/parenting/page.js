import ArticleListPage from "@/components/articles/ArticleListPage";

export const metadata = { title: "Parenting Islami — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ArticleListPage
      eyebrow="Keluarga"
      title="Parenting Islami"
      description="Panduan mendidik anak berdasarkan nilai-nilai Islam."
      section="PARENTING"
      basePath="/keluarga/parenting"
    />
  );
}
