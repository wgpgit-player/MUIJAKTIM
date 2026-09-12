import ArticleDetailPage from "@/components/articles/ArticleDetailPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <ArticleDetailPage
      section="HIKMAH_AKHLAK"
      slug={slug}
      backHref="/amalan/hikmah-akhlak"
      backLabel="Hikmah & Akhlak"
    />
  );
}
