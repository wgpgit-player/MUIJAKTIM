import Link from "next/link";
import InstagramLive from "./InstagramLive";
import MuiTvBox from "./MuiTvBox";

export default function HomeSidebar() {
  return (
    <div className="flex flex-col gap-5">
      {/* Galeri Instagram */}
      <div className="bg-white border border-line rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="#fff" stroke="none" />
              </svg>
            </div>
            <span className="font-extrabold text-[13.5px] text-ink">Galeri Instagram</span>
          </div>
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">Baru</span>
        </div>
        <InstagramLive variant="compact" count={4} />
        <a
          href="https://www.instagram.com/muijaktim"
          target="_blank"
          rel="noreferrer"
          className="block text-center text-[12px] font-bold text-green-dk mt-3.5 hover:text-emerald"
        >
          Ikuti @muijaktim &rarr;
        </a>
      </div>

      {/* MUI Jaktim TV */}
      <MuiTvBox />

      {/* Agenda Keummatan */}
      <div className="bg-white border border-line rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-extrabold text-[13.5px] text-ink">Agenda Keummatan</span>
          <Link href="/berita" className="text-[11.5px] font-bold text-green-dk hover:text-emerald">
            Semua
          </Link>
        </div>
        <div className="border border-dashed border-line rounded-xl py-7 text-center">
          <p className="text-[12px] text-ink-soft">Belum ada agenda terdekat.</p>
        </div>
      </div>
    </div>
  );
}
