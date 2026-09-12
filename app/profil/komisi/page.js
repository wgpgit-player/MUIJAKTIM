import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Bidang & Komisi — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

function totalAnggota(b) {
  // Ketua + Sekretaris + daftar anggota
  return 2 + (Array.isArray(b.members) ? b.members.length : 0);
}

export default async function KomisiPage() {
  const bidangList = await prisma.bidangKomisi.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="bg-green-dk2 px-5 py-10 md:px-16 md:py-14 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[24px] md:text-[32px] font-extrabold text-white uppercase tracking-wide">
            Bidang & Komisi
          </h1>
          <p className="text-white/70 text-[13.5px] md:text-[14.5px] leading-relaxed mt-3">
            Mengenal lebih dekat struktur, tugas, dan susunan kepengurusan setiap bidang yang mengabdi di
            Majelis Ulama Indonesia Kota Administrasi Jakarta Timur.
          </p>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-3 text-[12.5px] text-ink-soft flex items-center gap-1.5">
          <Link href="/profil" className="hover:text-green-dk2">Tentang Kami</Link>
          <span>&rsaquo;</span>
          <span className="text-green-dk2 font-bold">Bidang & Komisi</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-16 py-10 md:py-14">
        <div className="text-[12px] font-bold uppercase tracking-wide text-emerald mb-4">
          Daftar Bidang / Komisi
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {bidangList.map((b) => (
            <div
              key={b.slug}
              className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald to-green-dk2 shadow-[0_16px_32px_-14px_rgba(11,77,51,0.45)]"
            >
              {/* Pola dekoratif titik, samar */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />
              {/* Ikon dekoratif */}
              <div className="absolute top-5 right-5 w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9F27A" strokeWidth="1.8">
                  <circle cx="9" cy="8" r="3.2" />
                  <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
                  <circle cx="17" cy="9" r="2.4" />
                  <path d="M15 19c0-2.2 1.5-3.8 3.5-4" />
                </svg>
              </div>

              <div className="relative max-w-[75%]">
                <div className="font-extrabold text-[16px] text-white leading-snug mb-4">{b.name}</div>

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 pl-3 pr-1 py-1 mb-5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D9F27A" strokeWidth="2" className="shrink-0">
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 18.5c0-2.8 2.4-4.8 5.5-4.8s5.5 2 5.5 4.8" />
                  </svg>
                  <span className="text-[11.5px] font-semibold text-white/85">Total Anggota:</span>
                  <span className="w-6 h-6 rounded-full bg-lime text-green-dk2 text-[11px] font-extrabold flex items-center justify-center">
                    {totalAnggota(b)}
                  </span>
                </div>
              </div>

              <Link
                href={`/profil/komisi/${b.slug}`}
                className="relative inline-flex items-center gap-1.5 rounded-full bg-white text-green-dk2 text-[12.5px] font-bold px-4 py-2.5 hover:bg-lime transition-colors"
              >
                Lihat Kepengurusan
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          ))}
          {bidangList.length === 0 && (
            <p className="text-[13px] text-ink-soft col-span-2">Belum ada data bidang/komisi.</p>
          )}
        </div>

        <p className="text-[11.5px] text-ink-soft mt-8 leading-relaxed">
          Sumber: Surat Keputusan Dewan Pimpinan MUI Provinsi DKI Jakarta Nomor Kep-006/DP-P XI/II/2026 dan Surat
          Keputusan Dewan Pimpinan MUI Kota Administrasi Jakarta Timur Nomor Kep-001/DP-K 01/V/2026, Masa Khidmat
          2025 sampai 2030.
        </p>
      </div>
    </div>
  );
}
