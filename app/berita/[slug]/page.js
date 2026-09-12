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

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11.5px] font-bold px-3 py-1.5 rounded-full bg-lime text-green-dk2 w-fit inline-block mb-4">
            {news.category}
          </span>
          <h1 className="text-[24px] md:text-[32px] font-extrabold text-white leading-snug">{news.title}</h1>
          <div className="text-white/70 text-[13px] font-semibold mt-3">
            {formatDateID(news.publishedAt ?? news.createdAt)}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <p className="text-[14.5px] text-ink-soft leading-relaxed mb-6">{news.excerpt}</p>
        <div className="text-[14.5px] text-ink leading-relaxed whitespace-pre-wrap">{news.body}</div>

        <CommentSection contentType="news" contentId={news.id} path={`/berita/${news.slug}`} />
      </div>
    </div>
  );
}
