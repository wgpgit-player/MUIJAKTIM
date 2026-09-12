import { prisma } from "@/lib/prisma";
import { gradientFor } from "@/lib/newsGradient";
import NewsCard from "@/components/NewsCard";

export default async function NewsSectionPage({ eyebrow, title, description, section }) {
  const items = await prisma.news.findMany({
    where: { status: "PUBLISHED", section },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const news = items.map((n) => ({ ...n, date: n.publishedAt ?? n.createdAt, gradient: gradientFor(n.slug) }));

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2">{eyebrow}</div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">{title}</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-16 py-10 md:py-14">
        {news.length === 0 ? (
          <p className="text-[13.5px] text-ink-soft text-center py-10">Belum ada berita di bagian ini.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {news.map((item) => (
              <a key={item.slug} href={`/berita/${item.slug}`}>
                <NewsCard item={item} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
