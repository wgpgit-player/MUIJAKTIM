import ArticleListPage from "@/components/articles/ArticleListPage";

export const metadata = { title: "Doa & Dzikir — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ArticleListPage
      eyebrow="Amalan Harian"
      title="Doa & Dzikir"
      description="Kumpulan doa dan dzikir harian sesuai tuntunan."
      section="DOA_DZIKIR"
      basePath="/amalan/doa-dzikir"
    />
  );
}
