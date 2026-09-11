import Image from "next/image";
import Link from "next/link";

// Info kontak resmi bersumber dari akun Facebook terverifikasi MUI Kota Jakarta Timur
// (facebook.com/muijakartatimur) dan situs muijaktim.or.id.
const ADDRESS = "Jl. Swadaya Raya RT.8/RW.1 No. 2, Duren Sawit, Jakarta Timur, DKI Jakarta 13440";
const PHONE = "0812-3388-1973";
const EMAIL = "muijakartatimur@gmail.com";
const MAP_QUERY = encodeURIComponent("Jl. Swadaya Raya RT.8/RW.1 No 2, Duren Sawit, Jakarta Timur");

function SocialIcon({ children, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-8 h-8 rounded-full border border-white/20 text-white/80 flex items-center justify-center hover:bg-lime hover:text-green-dk2 hover:border-lime transition-colors"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="hidden md:block bg-green-dk2 px-16 pt-14 pb-7">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10 mb-10">
        {/* Kolom 1 — Identitas */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Image src="/logo.png" alt="" width={34} height={34} className="object-contain" />
            <span className="text-white font-extrabold text-[15px] leading-tight">
              Majelis Ulama Indonesia
              <span className="block text-[11px] font-semibold text-white/60">Kota Adm. Jakarta Timur</span>
            </span>
          </div>
          <p className="text-white/65 text-[13px] leading-relaxed max-w-[280px] mb-5">
            Wadah musyawarah para ulama, zuama, dan cendekiawan muslim di Jakarta Timur untuk mengayomi umat dan
            mengembangkan kehidupan yang islami.
          </p>
          <div className="flex items-center gap-2.5">
            <SocialIcon href="https://muijaktim.or.id">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://wa.me/6281233881973">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.55L3 20l1.05-5.4A8.5 8.5 0 1 1 21 11.5Z" />
                <path d="M8.5 10.5c.3 2.5 2.5 4.7 5 5" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.facebook.com/muijakartatimur/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.35A20 20 0 0 0 14.2 4.2c-2.28 0-3.84 1.39-3.84 3.94V10.5H8v3h2.36V21h3.14Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/muijakartatimur/">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        {/* Kolom 2 — Link Cepat */}
        <div>
          <div className="text-lime font-bold text-[13px] mb-3.5 flex items-center gap-2">
            <span className="w-1 h-3.5 bg-lime rounded-sm" />
            Link Cepat
          </div>
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <Link href="/profil" className="text-white/75 hover:text-lime">Profil Kami</Link>
            <Link href="/berita" className="text-white/75 hover:text-lime">Berita Terbaru</Link>
            <Link href="/profil?tab=pengurus" className="text-white/75 hover:text-lime">Bidang &amp; Komisi</Link>
            <Link href="/fatwa" className="text-white/75 hover:text-lime">Kumpulan Fatwa</Link>
          </div>
        </div>

        {/* Kolom 3 — Hubungi Kami */}
        <div>
          <div className="text-lime font-bold text-[13px] mb-3.5 flex items-center gap-2">
            <span className="w-1 h-3.5 bg-lime rounded-sm" />
            Hubungi Kami
          </div>
          <div className="flex flex-col gap-3.5 text-[13px] text-white/75">
            <div className="flex items-start gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A8E063" strokeWidth="2" className="shrink-0 mt-0.5">
                <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.3" />
              </svg>
              <span className="leading-relaxed">{ADDRESS}</span>
            </div>
            <a href={`tel:${PHONE.replace(/-/g, "")}`} className="flex items-center gap-2.5 hover:text-lime">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A8E063" strokeWidth="2" className="shrink-0">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
              </svg>
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 hover:text-lime">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A8E063" strokeWidth="2" className="shrink-0">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Kolom 4 — Lokasi */}
        <div>
          <div className="text-lime font-bold text-[13px] mb-3.5 flex items-center gap-2">
            <span className="w-1 h-3.5 bg-lime rounded-sm" />
            Lokasi
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg overflow-hidden border border-white/15 h-[130px] bg-white/5 hover:opacity-90 transition-opacity"
          >
            <iframe
              title="Lokasi Sekretariat MUI Jakarta Timur"
              src={`https://maps.google.com/maps?q=${MAP_QUERY}&z=15&output=embed`}
              className="w-full h-full pointer-events-none"
              loading="lazy"
            />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-5 text-[12.5px] text-white/50 text-center">
        &copy; {new Date().getFullYear()} Majelis Ulama Indonesia Kota Administrasi Jakarta Timur. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
