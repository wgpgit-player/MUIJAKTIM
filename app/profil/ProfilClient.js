"use client";

import { useState } from "react";
import Link from "next/link";
import { BIDANG_LIST, totalAnggota, PIMPINAN_INTI, DEWAN_PERTIMBANGAN } from "./bidang-data";

const TABS = [
  { key: "sejarah", label: "Sejarah Singkat" },
  { key: "visi-misi", label: "Visi & Misi" },
  { key: "pengurus", label: "Profil Pimpinan" },
];

function TabIcon({ tab, className }) {
  if (tab === "sejarah")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M4 19.5V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13" />
        <path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19" />
        <path d="M8 7h7M8 10.5h7" />
      </svg>
    );
  if (tab === "visi-misi")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    );
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3 4 6.5v4c0 5 3.4 8.6 8 9.8 4.6-1.2 8-4.8 8-9.8v-4z" />
    </svg>
  );
}

function Sejarah() {
  return (
    <div>
      <h2 className="text-[19px] md:text-[22px] font-extrabold text-green-dk2 mb-4">Sejarah Majelis Ulama Indonesia</h2>

      <p className="text-[14.5px] leading-relaxed text-ink-soft mb-4">
        Kelahiran Majelis Ulama Indonesia (MUI) Provinsi DKI Jakarta termasuk unik. Ia lahir pada tanggal 13
        Februari 1975, sekitar lima bulan lebih awal dibanding MUI Pusat yang lahir pada 17 Rajab 1395 H,
        bertepatan dengan 26 Juli 1975. Meski lahir mendahului organisasi induknya, MUI Provinsi DKI Jakarta tetap
        berhubungan secara organisatoris dan historis dengan MUI Pusat.
      </p>
      <p className="text-[14.5px] leading-relaxed text-ink-soft mb-4">
        Pendirian MUI dilatarbelakangi kesadaran kolektif umat Islam bahwa Indonesia memerlukan landasan kokoh bagi
        pembangunan masyarakat yang maju dan berakhlak. Sebelum MUI resmi berdiri, serangkaian pertemuan ulama dan
        tokoh Islam digelar untuk mematangkan gagasan sebuah majelis ulama yang menjalankan fungsi ijtihad
        kolektif serta memberi nasihat keagamaan kepada pemerintah dan masyarakat, di antaranya konferensi Pusat
        Dakwah Islam pada 30 September sampai 4 Oktober 1970 dan lokakarya mubaligh nasional pada 26 sampai 29
        November 1974.
      </p>
      <p className="text-[14.5px] leading-relaxed text-ink-soft mb-8">
        Puncaknya, pada tanggal 21 sampai 27 Juli 1975 digelar Musyawarah Nasional Majelis Ulama Indonesia di
        Jakarta, dihadiri utusan majelis ulama daerah, pengurus pusat organisasi Islam, ulama independen, dan
        wakil ABRI. Lima puluh tiga peserta menandatangani deklarasi pendirian MUI. Mengikuti semangat itu, pada
        Mei 1975 hampir seluruh daerah tingkat Kabupaten dan Provinsi, termasuk Jakarta Timur, turut membentuk
        Majelis Ulama di wilayahnya masing-masing.
      </p>

      <div className="text-[12px] font-bold uppercase tracking-wide text-emerald mb-3">Bidang Kerja MUI Jakarta Timur</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          "Fatwa",
          "Dakwah &amp; Pengembangan Masyarakat",
          "Pemberdayaan Ekonomi Umat",
          "Pendidikan &amp; Kaderisasi",
          "Perempuan, Remaja &amp; Keluarga",
          "Hukum &amp; Perundang-undangan",
          "Kajian Penelitian",
          "Pembinaan Seni Budaya Islam",
          "Informasi &amp; Komunikasi",
          "Ukhuwah Islamiyah &amp; KUB",
        ].map((text, i) => (
          <div
            key={i}
            className="border border-line rounded-lg px-4 py-3.5 text-[13.5px] text-ink-soft"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </div>

      <p className="text-[11.5px] text-ink-soft mt-6 leading-relaxed">
        Sumber: laman resmi{" "}
        <a href="https://muijaktim.or.id" target="_blank" rel="noreferrer" className="text-green-dk font-bold hover:underline">
          muijaktim.or.id
        </a>{" "}
        dan Surat Keputusan Dewan Pimpinan MUI Provinsi DKI Jakarta Nomor Kep-006/DP-P XI/II/2026.
      </p>
    </div>
  );
}

function VisiMisi() {
  return (
    <div>
      <h2 className="text-[19px] md:text-[22px] font-extrabold text-green-dk2 mb-5">Visi &amp; Misi</h2>

      <div className="text-[12px] font-bold uppercase tracking-wide text-emerald mb-2">Visi</div>
      <p className="text-[15px] leading-relaxed font-semibold text-ink mb-7">
        Terwujudnya umat Islam Jakarta Timur yang berakhlak mulia, moderat, dan berdaya, di bawah bimbingan ulama
        yang amanah.
      </p>

      <div className="text-[12px] font-bold uppercase tracking-wide text-emerald mb-3">Misi</div>
      <div className="flex flex-col gap-3">
        {[
          "Menjadi rujukan fatwa dan bimbingan keagamaan yang kredibel bagi umat.",
          "Menguatkan ukhuwah islamiyah dan moderasi beragama di tengah masyarakat.",
          "Menjadi mitra strategis pemerintah dalam pembinaan kehidupan beragama.",
        ].map((text, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald/10 text-green text-[12px] font-extrabold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </div>
            <div className="text-[14px] leading-relaxed text-ink-soft">{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonCard({ nama, jabatan }) {
  return (
    <div className="bg-cream border border-line rounded-lg p-5 flex gap-4 items-center">
      <div className="w-12 h-12 rounded-full bg-green-dk flex-shrink-0 flex items-center justify-center text-white font-extrabold text-[15px]">
        {nama.replace(/^[^A-Za-z]*/, "").charAt(0)}
      </div>
      <div>
        <div className="font-extrabold text-[14px] leading-snug">{nama}</div>
        <div className="text-[12px] text-emerald font-bold mt-1">{jabatan}</div>
      </div>
    </div>
  );
}

function BidangDirectoryCard({ b }) {
  return (
    <div className="border border-line rounded-lg p-5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="font-extrabold text-[14px] text-green-dk2 leading-snug">{b.nama}</div>
        <div className="text-[12px] text-ink-soft mt-1">
          Ketua: <span className="font-semibold text-ink">{b.ketua}</span>
        </div>
        <div className="text-[11.5px] text-ink-soft mt-1.5">
          Total <span className="font-bold text-emerald">{totalAnggota(b)}</span> anggota terdaftar
        </div>
      </div>
      <Link
        href={`/profil/komisi/${b.slug}`}
        className="shrink-0 rounded-md bg-green-dk2 text-white text-[12px] font-bold px-3.5 py-2 hover:bg-green-dk transition-colors whitespace-nowrap"
      >
        Lihat Kepengurusan
      </Link>
    </div>
  );
}

function Pengurus() {
  return (
    <div>
      <h2 className="text-[19px] md:text-[22px] font-extrabold text-green-dk2 mb-1">Susunan Pengurus</h2>
      <p className="text-[12.5px] text-ink-soft mb-5">
        Masa Khidmat 2025 sampai 2030, sesuai SK Dewan Pimpinan MUI Provinsi DKI Jakarta Nomor
        Kep-006/DP-P&nbsp;XI/II/2026 dan SK Internal Nomor Kep-001/DP-K&nbsp;01/V/2026.
      </p>

      <div className="text-[12px] font-bold uppercase tracking-wide text-emerald mb-3">Pimpinan Inti</div>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {PIMPINAN_INTI.map((p, i) => (
          <PersonCard key={i} nama={p.nama} jabatan={p.jabatan} />
        ))}
      </div>

      <div className="text-[12px] font-bold uppercase tracking-wide text-emerald mb-3">Dewan Pertimbangan</div>
      <div className="border border-line rounded-lg p-6 mb-8">
        <div className="grid sm:grid-cols-3 gap-5 text-[13.5px] mb-4">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-soft mb-1">Ketua</div>
            <div className="font-semibold">{DEWAN_PERTIMBANGAN.ketua}</div>
          </div>
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-soft mb-1">Wakil Ketua</div>
            <div className="font-semibold">{DEWAN_PERTIMBANGAN.wakilKetua}</div>
          </div>
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-soft mb-1">Sekretaris</div>
            <div className="font-semibold">{DEWAN_PERTIMBANGAN.sekretaris}</div>
          </div>
        </div>
        <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-soft mb-1.5">Anggota</div>
        <div className="grid sm:grid-cols-2 gap-x-6 text-[13.5px] font-semibold leading-relaxed text-ink">
          {DEWAN_PERTIMBANGAN.anggota.map((a, i) => (
            <div key={i}>{a}</div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-bold uppercase tracking-wide text-emerald">Bidang & Komisi</div>
        <Link href="/profil/komisi" className="text-[12px] font-bold text-green-dk hover:text-emerald">
          Lihat Semua &rarr;
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {BIDANG_LIST.map((b) => (
          <BidangDirectoryCard key={b.slug} b={b} />
        ))}
      </div>

      <p className="text-[11.5px] text-ink-soft mt-6 leading-relaxed">
        Sumber: Surat Keputusan Dewan Pimpinan MUI Provinsi DKI Jakarta Nomor Kep-006/DP-P XI/II/2026 (Pengukuhan
        Dewan Pimpinan &amp; Dewan Pertimbangan) dan Surat Keputusan Dewan Pimpinan MUI Kota Administrasi Jakarta
        Timur Nomor Kep-001/DP-K 01/V/2026 (Susunan Pengurus Bidang), Masa Khidmat 2025 sampai 2030.
      </p>
    </div>
  );
}

export default function ProfilClient({ initialTab }) {
  const [tab, setTab] = useState(TABS.some((t) => t.key === initialTab) ? initialTab : "sejarah");

  const tabLabel = TABS.find((t) => t.key === tab)?.label ?? "Sejarah Singkat";

  return (
    <div>
      <div className="bg-green-dk2 px-5 py-10 md:px-16 md:py-14 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[24px] md:text-[32px] font-extrabold text-white uppercase tracking-wide">
            Profil Kelembagaan
          </h1>
          <p className="text-white/70 text-[13.5px] md:text-[14.5px] leading-relaxed mt-3">
            Mengenal lebih dekat sejarah, visi, misi, serta susunan kepengurusan Majelis Ulama Indonesia Kota
            Administrasi Jakarta Timur sebagai pelayan umat dan mitra pemerintah.
          </p>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-3 text-[12.5px] text-ink-soft flex items-center gap-1.5">
          <span>Beranda</span>
          <span>&rsaquo;</span>
          <span>Tentang Kami</span>
          <span>&rsaquo;</span>
          <span className="text-green-dk2 font-bold">{tabLabel}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-16 py-10 md:py-14 grid md:grid-cols-[240px_1fr] gap-8">
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 flex items-center gap-2.5 rounded-lg px-4 py-3 text-[13.5px] font-bold text-left transition-colors ${
                tab === t.key
                  ? "bg-green-dk2 text-white"
                  : "bg-white border border-line text-ink-soft hover:border-green-dk hover:text-green-dk2"
              }`}
            >
              <TabIcon tab={t.key} className={tab === t.key ? "text-lime" : "text-ink-soft"} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-line rounded-lg p-6 md:p-8">
          {tab === "sejarah" && <Sejarah />}
          {tab === "visi-misi" && <VisiMisi />}
          {tab === "pengurus" && <Pengurus />}
        </div>
      </div>
    </div>
  );
}
