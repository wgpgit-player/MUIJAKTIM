import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ArticleDetailPage({ section, slug, backHref, backLabel }) {
  const item = await prisma.article.findUnique({ where: { section_slug: { section, slug } } });
  if (!item || item.status !== "PUBLISHED") notFound();

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-3xl mx-auto">
          <a href={backHref} className="text-[12.5px] text-lime font-bold mb-2 inline-block hover:underline">
            &larr; {backLabel}
          </a>
          <h1 className="text-[22px] md:text-[30px] font-extrabold text-white leading-snug">{item.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
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
