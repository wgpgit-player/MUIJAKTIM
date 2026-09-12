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
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2">Beranda &rsaquo; Berita &amp; Opini</div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white mb-2">Kabar Jakarta Timur</h1>
          <p className="text-white/75 text-[14px] max-w-md">
            Kabar kegiatan, opini ulama, dan rilis pers resmi MUI Jakarta Timur.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-16 py-6 flex gap-2.5 overflow-x-auto">
        {[
          { label: "Semua", href: "/berita", active: true },
          { label: "Kabar Jakarta Timur", href: "/berita/kabar-jakarta-timur" },
          { label: "Opini Ulama", href: "/berita/opini" },
          { label: "Rilis Pers & Maklumat", href: "/berita/rilis-pers" },
        ].map((f) => (
          <a
            key={f.label}
            href={f.href}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-bold transition-colors ${
              f.active ? "bg-green-dk text-white" : "bg-white border border-line text-ink-soft hover:border-green-dk hover:text-green-dk"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {featured && (
        <div className="max-w-7xl mx-auto px-5 md:px-16 mb-6">
          <a
            href={`/berita/${featured.slug}`}
            className="block bg-white border border-line rounded-2xl overflow-hidden md:grid md:grid-cols-2 hover:border-emerald/40 transition-colors"
          >
            <div className={`bg-gradient-to-br ${featured.gradient} min-h-[220px] md:min-h-[280px] flex items-end p-7`}>
              <span className="text-[11.5px] font-bold px-3 py-1.5 rounded-full bg-white/92 text-green-dk w-fit">
                {featured.category}
              </span>
            </div>
            <div className="p-7 md:p-9 flex flex-col justify-center">
              <div className="text-[12.5px] text-ink-soft font-semibold mb-2.5">{formatDateID(featured.date)}</div>
              <div className="text-[19px] md:text-[21px] font-extrabold leading-snug text-green-dk2 mb-3">
                {featured.title}
              </div>
              <div className="text-[13.5px] text-ink-soft leading-relaxed">{featured.excerpt}</div>
            </div>
          </a>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 md:px-16 pb-14">
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((item) => (
              <a key={item.slug} href={`/berita/${item.slug}`}>
                <NewsCard item={item} />
              </a>
            ))}
            {rest.length === 0 && !featured && (
              <p className="text-[13px] text-ink-soft col-span-2">
                Belum ada berita yang tayang. Tambahkan lewat panel admin.
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
