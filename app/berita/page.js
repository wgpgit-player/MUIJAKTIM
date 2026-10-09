import NewsFilters from "@/components/NewsFilters";
import NewsImage from "@/components/NewsImage";
import PageHeader from "@/components/PageHeader";
import NewsCard from "@/components/NewsCard";
import ExternalNewsFeed from "@/components/ExternalNewsFeed";
import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import { gradientFor } from "@/lib/newsGradient";

export const metadata = {
  title: "Berita & Opini — MUI Jakarta Timur",
};
export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const published = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const withGradient = published.map((n) => ({ ...n, date: n.publishedAt ?? n.createdAt, gradient: gradientFor(n.slug) }));
  const featured = withGradient.find((b) => b.featured) ?? withGradient[0];
  const rest = withGradient.filter((b) => b.id !== featured?.id);

  return (
    <div>
      <PageHeader title="Kabar Jakarta Timur" desc="Kabar kegiatan, opini ulama, dan rilis pers resmi MUI Jakarta Timur." />

      <NewsFilters />

      {featured && (
        <div className="site-container mb-6">
          <a
            href={`/berita/${featured.slug}`}
            className="featured-news block bg-white border border-line rounded-2xl overflow-hidden md:grid md:grid-cols-2 hover:border-emerald/40 transition-colors"
          >
            <NewsImage src={featured.imageUrl} alt={featured.title} category={featured.category} featured />
            <div className="p-5 md:p-8 flex flex-col justify-center">
              <div className="text-[12.5px] text-ink-soft font-semibold mb-2.5">{formatDateID(featured.date)}</div>
              <div className="text-[19px] md:text-[21px] font-extrabold leading-snug text-green-dk2 mb-3">
                {featured.title}
              </div>
              <div className="text-[13.5px] text-ink-soft leading-relaxed">{featured.excerpt}</div>
            </div>
          </a>
        </div>
      )}

      <div className="site-container pb-14">
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((item) => (
              <a key={item.slug} href={`/berita/${item.slug}`}>
                <NewsCard item={item} />
              </a>
            ))}
            {rest.length === 0 && !featured && (
              <p className="text-[13px] text-ink-soft sm:col-span-2">
                Belum ada berita yang diterbitkan. Silakan kunjungi kembali halaman ini.
              </p>
            )}
          </div>

          <div className="md:sticky md:top-6">
            <ExternalNewsFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
