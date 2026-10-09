import NewsFilters from "@/components/NewsFilters";
import PageHeader from "@/components/PageHeader";
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
      <PageHeader title={title} desc={description} />

      <NewsFilters />
      <div className="site-container py-10 md:py-14">
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
