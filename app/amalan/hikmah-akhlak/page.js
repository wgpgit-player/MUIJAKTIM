import ArticleListPage from "@/components/articles/ArticleListPage";

export const metadata = { title: "Hikmah & Akhlak — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ArticleListPage
      eyebrow="Amalan Harian"
      title="Hikmah & Akhlak"
      description="Renungan dan hikmah untuk membentuk akhlak mulia."
      section="HIKMAH_AKHLAK"
      basePath="/amalan/hikmah-akhlak"
    />
  );
}
