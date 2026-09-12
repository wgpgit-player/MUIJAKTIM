import ArticleDetailPage from "@/components/articles/ArticleDetailPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <ArticleDetailPage
      section="FIQIH_WANITA"
      slug={slug}
      backHref="/keluarga/fiqih-wanita"
      backLabel="Fiqih Wanita"
    />
  );
}
