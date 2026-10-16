import Icon from "./Icon";
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
              <Icon name="globe-outline" size={18} className="shrink-0"/>
            </SocialIcon>
            <SocialIcon href="https://wa.me/6281233881973">
              <Icon name="logo-whatsapp" size={18} className="shrink-0"/>
            </SocialIcon>
            <SocialIcon href="https://www.facebook.com/muijakartatimur/">
              <Icon name="logo-facebook" size={18} className="shrink-0"/>
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/muijakartatimur/">
              <Icon name="logo-instagram" size={18} className="shrink-0"/>
            </SocialIcon>
          </div>
        </div>

        {/* Kolom 2 — Link Cepat */}
        <div>
          <div className="text-lime font-bold text-[13px] mb-3.5 flex items-center gap-2">
            
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
            
            Hubungi Kami
          </div>
          <div className="flex flex-col gap-3.5 text-[13px] text-white/75">
            <div className="flex items-start gap-2.5">
              <Icon name="location-outline" size={18} className="shrink-0"/>
              <span className="leading-relaxed">{ADDRESS}</span>
            </div>
            <a href={`tel:${PHONE.replace(/-/g, "")}`} className="flex items-center gap-2.5 text-white/75 hover:text-lime">
              <Icon name="call-outline" size={18} className="shrink-0"/>
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2.5 text-white/75 hover:text-lime">
              <Icon name="mail-outline" size={18} className="shrink-0"/>
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Kolom 4 — Lokasi */}
        <div>
          <div className="text-lime font-bold text-[13px] mb-3.5 flex items-center gap-2">
            
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
