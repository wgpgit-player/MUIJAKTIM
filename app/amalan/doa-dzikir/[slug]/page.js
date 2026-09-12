import ArticleDetailPage from "@/components/articles/ArticleDetailPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <ArticleDetailPage
      section="DOA_DZIKIR"
      slug={slug}
      backHref="/amalan/doa-dzikir"
      backLabel="Doa & Dzikir"
    />
  );
}
