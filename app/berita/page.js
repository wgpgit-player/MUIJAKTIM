import NewsCard from "@/components/NewsCard";
import ExternalNewsFeed from "@/components/ExternalNewsFeed";
import { beritaList } from "@/data/berita";

export const metadata = {
  title: "Berita & Opini — MUI Jakarta Timur",
};

export default function BeritaPage() {
  const featured = beritaList.find((b) => b.featured);
  const rest = beritaList.filter((b) => !b.featured);

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
        {["Semua", "Kabar Jakarta Timur", "Opini Ulama", "Rilis Pers & Makumat"].map((f, i) => (
          <div
            key={f}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-bold ${
              i === 0 ? "bg-green-dk text-white" : "bg-white border border-line text-ink-soft"
            }`}
          >
            {f}
          </div>
        ))}
      </div>

      {featured && (
        <div className="max-w-7xl mx-auto px-5 md:px-16 mb-6">
          <div className="bg-white border border-line rounded-2xl overflow-hidden md:grid md:grid-cols-2">
            <div className={`bg-gradient-to-br ${featured.gradient} min-h-[220px] md:min-h-[280px] flex items-end p-7`}>
              <span className="text-[11.5px] font-bold px-3 py-1.5 rounded-full bg-white/92 text-green-dk w-fit">
                {featured.category}
              </span>
            </div>
            <div className="p-7 md:p-9 flex flex-col justify-center">
              <div className="text-[12.5px] text-ink-soft font-semibold mb-2.5">{featured.date}</div>
              <div className="text-[19px] md:text-[21px] font-extrabold leading-snug text-green-dk2 mb-3">
                {featured.title}
              </div>
              <div className="text-[13.5px] text-ink-soft leading-relaxed">{featured.excerpt}</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 md:px-16 pb-14">
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>

          <div className="md:sticky md:top-6">
            <ExternalNewsFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
