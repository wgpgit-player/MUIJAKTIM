import ArticleListPage from "@/components/articles/ArticleListPage";

export const metadata = { title: "Fiqih Wanita — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ArticleListPage
      eyebrow="Keluarga"
      title="Fiqih Wanita"
      description="Panduan fikih seputar kehidupan perempuan muslimah."
      section="FIQIH_WANITA"
      basePath="/keluarga/fiqih-wanita"
    />
  );
}
