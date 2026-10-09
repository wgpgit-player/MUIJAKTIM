import PageHeader from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ArticleDetailPage({ section, slug, backHref, backLabel }) {
  const item = await prisma.article.findUnique({ where: { section_slug: { section, slug } } });
  if (!item || item.status !== "PUBLISHED") notFound();

  return (
    <div>
      <PageHeader title={item.title} variant="article" breadcrumbs={[{label:backLabel,href:backHref}]} />

      <div className="reading-container py-8 md:py-12">
        {item.extra && item.extra.arabic && (
          <p dir="rtl" className="text-[26px] leading-loose text-right text-green-dk2 font-arabic mb-4">
            {item.extra.arabic}
          </p>
        )}
        {item.extra && item.extra.latin && (
          <p className="text-[14px] italic text-ink-soft mb-4">{item.extra.latin}</p>
        )}
        <div className="text-[14.5px] text-ink leading-relaxed whitespace-pre-wrap">{item.body}</div>
      </div>
    </div>
  );
}
