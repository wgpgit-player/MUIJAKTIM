import ArticleDetailPage from "@/components/articles/ArticleDetailPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <ArticleDetailPage
      section="PARENTING"
      slug={slug}
      backHref="/keluarga/parenting"
      backLabel="Parenting Islami"
    />
  );
}
