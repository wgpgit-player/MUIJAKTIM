import NewsImage from "@/components/NewsImage";
import PageHeader from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import CommentSection from "@/components/CommentSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({ where: { slug } });
  return { title: news ? `${news.title} — MUI Jakarta Timur` : "Berita — MUI Jakarta Timur" };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({ where: { slug } });

  if (!news || news.status !== "PUBLISHED") notFound();

  const isHtmlBody = /<[a-z][\s\S]*>/i.test(news.body);

  const plainBody=news.body.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
  const excerpt=(news.excerpt||'').replace(/\s+/g,' ').trim();
  const repeated=!!excerpt && plainBody.startsWith(excerpt);
  return (
    <div>
      <PageHeader title={news.title} variant="article" breadcrumbs={[{label:"Berita & Opini",href:"/berita"}]}><span>{news.category} · MUI Jakarta Timur</span><span>{formatDateID(news.publishedAt ?? news.createdAt)}</span></PageHeader>

      <div className="reading-container py-8 md:py-12">
        {news.imageUrl && <div className="article-image"><NewsImage src={news.imageUrl} alt={news.title}/></div>}
        {!repeated && excerpt && <p className="article-intro">{news.excerpt}</p>}
        {isHtmlBody ? (
          <div className="prose-news text-[16px] text-ink leading-relaxed" dangerouslySetInnerHTML={{ __html: news.body }} />
        ) : (
          <div className="text-[16px] text-ink leading-relaxed whitespace-pre-wrap">{news.body}</div>
        )}

        <CommentSection contentType="news" contentId={news.id} path={`/berita/${news.slug}`} />
      </div>
    </div>
  );
}
