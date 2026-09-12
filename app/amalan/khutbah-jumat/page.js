import ArticleListPage from "@/components/articles/ArticleListPage";

export const metadata = { title: "Khutbah Jumat — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ArticleListPage
      eyebrow="Amalan Harian"
      title="Khutbah Jumat"
      description="Naskah khutbah Jumat siap pakai untuk khatib."
      section="KHUTBAH_JUMAT"
      basePath="/amalan/khutbah-jumat"
    />
  );
}
