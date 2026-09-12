import ArticleDetailPage from "@/components/articles/ArticleDetailPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <ArticleDetailPage
      section="KITAB_TURATS"
      slug={slug}
      backHref="/kitab/turats"
      backLabel="Kitab Turats"
    />
  );
}
