import ArticleDetailPage from "@/components/articles/ArticleDetailPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <ArticleDetailPage
      section="KHUTBAH_JUMAT"
      slug={slug}
      backHref="/amalan/khutbah-jumat"
      backLabel="Khutbah Jumat"
    />
  );
}
