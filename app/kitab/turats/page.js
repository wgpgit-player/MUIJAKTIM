import ArticleListPage from "@/components/articles/ArticleListPage";

export const metadata = { title: "Kitab Turats — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ArticleListPage
      eyebrow="Kitab & Referensi"
      title="Kitab Turats"
      description="Pengantar dan ringkasan kitab-kitab turats klasik."
      section="KITAB_TURATS"
      basePath="/kitab/turats"
    />
  );
}
