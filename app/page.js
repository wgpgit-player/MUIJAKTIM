import Link from "next/link";
import NewsHighlight from "@/components/NewsHighlight";
import NewsSmallCard from "@/components/NewsSmallCard";
import HomeSidebar from "@/components/HomeSidebar";
import QuoteCard from "@/components/QuoteCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import HighlightCards from "@/components/HighlightCards";
import AdBannerPlaceholder from "@/components/AdBannerPlaceholder";
import MobileHero from "@/components/MobileHero";
import MobileQuickAccess from "@/components/MobileQuickAccess";
import MobileNewsRow from "@/components/MobileNewsRow";
import { prisma } from "@/lib/prisma";
import { gradientFor } from "@/lib/newsGradient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [newsRows, heroSlides, quickIcons] = await Promise.all([
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    }),
    prisma.heroSlide.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.quickIcon.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const desktopIcons = quickIcons.filter((i) => i.showOnDesktop);
  const mobileIcons = quickIcons.filter((i) => i.showOnMobile);

  const news = newsRows.map((n) => ({
    ...n,
    date: n.publishedAt ?? n.createdAt,
    gradient: gradientFor(n.slug),
  }));
  const featured = news.find((b) => b.featured) ?? news[0];
  const smallNews = featured ? news.filter((b) => b.slug !== featured.slug).slice(0, 4) : [];

  return (
    <div>
      {/* MOBILE — ala NU Online (ATM): tiap section berdiri sendiri, tidak ada yang mengambang */}
      <MobileHero heroImageUrl={heroSlides[0]?.imageUrl} />
      <MobileQuickAccess icons={mobileIcons} />

      {/* MOBILE — Headline list rapat, mengikuti pola referensi persis (bukan kartu terpisah) */}
      <section className="md:hidden px-5 pt-5 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-green-dk rounded-sm" />
            <h2 className="text-[14.5px] font-semibold text-ink">Headline</h2>
          </div>
          <Link href="/berita" className="text-ink-soft">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
        <div>
          {featured &&
            [featured, ...smallNews].map((item) => <MobileNewsRow key={item.slug} item={item} />)}
        </div>
      </section>

      {/* DESKTOP HERO — full-bleed blurred slideshow, plain navbar overlay, compact top-anchored copy (Mercury-style) */}
      <section className="hidden md:flex relative overflow-hidden min-h-[560px] md:min-h-[620px] flex-col items-center justify-center text-center pb-16 md:pb-20">
        <HeroSlideshow slides={heroSlides} />

        <div className="relative z-10 w-full px-5 pt-24 md:px-8 md:pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/25 px-3.5 py-1.5 rounded-full text-lime text-[10.5px] font-bold uppercase tracking-widest mb-4">
            #MUIJAKTIM
          </div>
          <h1 className="max-w-2xl mx-auto text-[30px] md:text-[48px] leading-[1.1] font-extrabold text-white tracking-tight mb-3">
            Rumah Fatwa &amp; Dakwah Jakarta Timur
          </h1>
          <p className="max-w-md mx-auto text-white/75 text-[13px] md:text-[14.5px] leading-relaxed mb-6">
            Menghimpun ulama, zuama, dan cendekiawan muslim untuk membimbing, membina, dan melayani umat
            Islam Jakarta Timur.
          </p>

          {/* CTA — kaca/glass, iOS-style */}
          <form
            action="/fatwa"
            className="max-w-md mx-auto flex items-center gap-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-full p-2 pl-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" className="shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              name="q"
              placeholder="Cari fatwa, mis. zakat penghasilan..."
              className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-white/60 py-2"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold text-[12.5px] px-5 py-2.5 hover:bg-white/30 transition-colors"
            >
              Cari Fatwa
            </button>
          </form>
        </div>
      </section>

      {/* HIGHLIGHT FITUR — bar mengambang menembus batas hero, style kaca mengikuti hero (desktop) */}
      <div className="hidden md:block relative z-20 -mt-10 md:-mt-8 px-5 md:px-16">
        <HighlightCards icons={desktopIcons} />
      </div>

      {/* RUANG IKLAN — jadwal sholat sudah dipindah ke bar utilitas atas navbar */}
      <section className="hidden md:block px-5 pt-8 pb-4 md:px-16 md:pt-10 md:pb-6">
        <div className="max-w-7xl mx-auto">
          <AdBannerPlaceholder />
        </div>
      </section>

      {/* SOROTAN UTAMA — berita + sidebar (desktop; mobile pakai Headline list di atas) */}
      <section className="hidden md:block px-5 pt-4 pb-10 md:px-16 md:pt-6 md:pb-14">
        <div className="max-w-7xl mx-auto">
          {/* Baris 1 — heading berita + heading kutipan, sejajar */}
          <div className="grid md:grid-cols-[1.7fr_1fr] gap-8 mb-4">
            <h2 className="text-[18px] md:text-[22px] font-extrabold text-green-dk2">Sorotan Utama</h2>
            <h2 className="text-[18px] md:text-[22px] font-extrabold text-green-dk2">Mutiara Hikmah</h2>
          </div>

          {/* Baris 2 — kartu berita utama + kartu kutipan, tinggi disamakan (simetris) */}
          <div className="grid md:grid-cols-[1.7fr_1fr] gap-8 items-stretch">
            {featured ? <NewsHighlight item={featured} /> : <div />}
            <QuoteCard />
          </div>

          {/* Baris 3 — berita terbaru + sidebar (Instagram, TV, agenda) */}
          <div className="grid md:grid-cols-[1.7fr_1fr] gap-8 mt-8">
            <div>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-[16px] md:text-[18px] font-extrabold text-green-dk2">Berita Terbaru</h3>
                <Link href="/berita" className="text-[13px] font-bold text-green-dk hover:text-emerald">
                  Lihat Semua &rarr;
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {smallNews.map((item) => (
                  <NewsSmallCard key={item.slug} item={item} />
                ))}
              </div>
            </div>

            <HomeSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
