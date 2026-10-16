import Link from "next/link";
import NewsHighlight from "@/components/NewsHighlight";
import NewsSmallCard from "@/components/NewsSmallCard";
import PwaInstall from "@/components/PwaInstall";
import HeroSearch from "@/components/HeroSearch";
import HomeInteractions from "@/components/HomeInteractions";
import Icon from "@/components/Icon";
import HomeSidebar from "@/components/HomeSidebar";
import QuoteCard from "@/components/QuoteCard";
import HeroBanner from "@/components/HeroBanner";
import HighlightCards from "@/components/HighlightCards";
import AdBanner from "@/components/AdBanner";
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

  const configuredDesktopIcons = quickIcons.filter((i) => i.showOnDesktop);
  const desktopIcons = configuredDesktopIcons.length ? configuredDesktopIcons : [
    { id: "zakat", label: "Kalkulator Zakat", description: "Hitung zakat Anda", linkUrl: "/layanan/kalkulator-zakat", iconName: "calculator-outline" },
    { id: "fatwa", label: "Fiqih & Fatwa", description: "Kumpulan fatwa MUI", linkUrl: "/fatwa", iconName: "document-text-outline" },
    { id: "layanan", label: "Layanan Umat", description: "Jawaban dari ulama", linkUrl: "/layanan", iconName: "chatbubbles-outline" },
    { id: "profil", label: "Profil & Pimpinan", description: "Pimpinan MUI Jaktim", linkUrl: "/profil", iconName: "people-outline" },
  ];
  const configuredMobileIcons = quickIcons.filter((i) => i.showOnMobile);
  const mobileIcons = configuredMobileIcons.length ? configuredMobileIcons : [
    {id:'fatwa',label:'Fatwa',linkUrl:'/fatwa',iconName:'document-text-outline'},
    {id:'tanya',label:'Tanya Ulama',linkUrl:'/layanan/tanya-ulama',iconName:'chatbubbles-outline'},
    {id:'shalat',label:'Jadwal Shalat',linkUrl:'/layanan/jadwal-shalat',iconName:'time-outline'},
    {id:'zakat',label:'Zakat',linkUrl:'/layanan/kalkulator-zakat',iconName:'calculator-outline'},
    {id:'quran',label:"Al-Qur’an",linkUrl:'/kitab/al-quran',iconName:'book-outline'},
    {id:'khutbah',label:'Khutbah',linkUrl:'/amalan/khutbah-jumat',iconName:'document-text-outline'},
    {id:'kiblat',label:'Kiblat',linkUrl:'/layanan/jadwal-shalat',iconName:'compass-outline'},
    {id:'profil',label:'Profil MUI',linkUrl:'/profil',iconName:'people-outline'},
  ];

  const news = newsRows.map((n) => ({
    ...n,
    date: n.publishedAt ?? n.createdAt,
    gradient: gradientFor(n.slug),
  }));
  const featured = news.find((b) => b.featured) ?? news[0];
  const smallNews = featured ? news.filter((b) => b.slug !== featured.slug).slice(0, 4) : [];

  return <div className="home-page">
    <MobileHero heroImageUrl={heroSlides[0]?.imageUrl}/>
    <section className="home-hero hidden md:flex">
      <HeroBanner slide={heroSlides[0]}/><div className="hero-pattern" aria-hidden="true"/>
      <div className="hero-copy site-container"><h1>Rumah Fatwa &amp; Dakwah <span className="block">Jakarta Timur</span></h1>
        <p>Menghimpun ulama, zuama, dan cendekiawan muslim untuk membimbing, membina, dan melayani umat Islam Jakarta Timur.</p><HeroSearch/>
      </div>
    </section>
    <div className="home-quick-access hidden md:block site-container"><HighlightCards icons={desktopIcons}/></div>
    <MobileQuickAccess icons={mobileIcons}/>
    <section className="home-news site-container" data-reveal>
      <div className="section-heading"><div><h2><span className="md:hidden">Headline</span><span className="hidden md:inline">Kabar MUI Jakarta Timur</span></h2><p>Kegiatan, pandangan ulama, dan informasi untuk umat.</p></div><Link href="/berita">Semua berita <Icon name="arrow-forward-outline" size={18}/></Link></div>
      {featured ? <div className="editorial-grid"><NewsHighlight item={featured}/><div className="supporting-news">{smallNews.map(item=><NewsSmallCard key={item.slug} item={item}/>)}</div></div> : <p className="empty-news">Berita terbaru belum tersedia. <Link href="/berita">Jelajahi kanal berita</Link>.</p>}
    </section>
    <PwaInstall/><section className="home-services" data-reveal><div className="site-container">
      <div className="section-heading"><div><h2>Layanan untuk Umat</h2><p>Temukan rujukan dan bantuan sesuai kebutuhan Anda.</p></div><Link href="/layanan">Semua layanan <Icon name="arrow-forward-outline" size={18}/></Link></div>
      <div className="service-grid">{[
        {href:'/layanan/tanya-ulama',icon:'chatbubbles-outline',title:'Tanya Ulama',desc:'Tanya jawab agama untuk panduan sehari-hari.'},
        {href:'/layanan/jadwal-shalat',icon:'time-outline',title:'Jadwal Shalat',desc:'Waktu shalat dan arah kiblat di lokasi Anda.'},
        {href:'/layanan/kalkulator-zakat',icon:'calculator-outline',title:'Kalkulator Zakat',desc:'Bantu menghitung kewajiban zakat Anda.'},
        {href:'/amalan/khutbah-jumat',icon:'book-outline',title:'Khutbah Jumat',desc:'Naskah khutbah dan materi dakwah.'},
      ].map(item=><Link key={item.href} href={item.href} className="service-card"><span className="service-icon"><Icon name={item.icon} size={28}/></span><h3>{item.title}</h3><p>{item.desc}</p><Icon name="arrow-forward-outline" size={20}/></Link>)}</div>
    </div></section>
    <section className="home-hikmah site-container" data-reveal><div className="hikmah-heading"><h2>Mutiara Hikmah</h2><p>Ilmu sebagai bekal untuk kehidupan yang lebih baik.</p><Link href="/amalan/hikmah-akhlak">Baca hikmah <Icon name="arrow-forward-outline" size={18}/></Link></div><QuoteCard/></section>
    <section className="home-media site-container" data-reveal><div className="section-heading"><div><h2>Media &amp; Agenda</h2><p>Ikuti kabar dan kajian melalui kanal resmi MUI Jakarta Timur.</p></div></div><HomeSidebar/></section>
    <section className="site-container home-ad"><AdBanner placement="homepage_leaderboard"/></section>
    <HomeInteractions/>
  </div>;
}
