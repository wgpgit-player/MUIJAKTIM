import Link from "next/link";
import { notFound } from "next/navigation";
import { BIDANG_LIST, getBidangBySlug, totalAnggota } from "../../bidang-data";

export function generateStaticParams() {
  return BIDANG_LIST.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }) {
  const b = getBidangBySlug(params.slug);
  return { title: b ? `${b.nama} — MUI Jakarta Timur` : "Bidang & Komisi — MUI Jakarta Timur" };
}

export default function KomisiDetailPage({ params }) {
  const b = getBidangBySlug(params.slug);
  if (!b) return notFound();

  const rows = [
    { nama: b.ketua, jabatan: "Ketua Bidang" },
    { nama: b.sekretaris, jabatan: "Sekretaris Bidang" },
    ...b.anggota.map((a) => ({ nama: a, jabatan: "Anggota" })),
  ];

  return (
    <div>
      <div className="bg-green-dk2 px-5 py-10 md:px-16 md:py-14 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[22px] md:text-[30px] font-extrabold text-white leading-snug">{b.nama}</h1>
          <p className="text-white/70 text-[13.5px] md:text-[14.5px] mt-3">
            Total {totalAnggota(b)} Anggota Terdaftar
          </p>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="max-w-5xl mx-auto px-5 md:px-16 py-3 text-[12.5px] text-ink-soft flex items-center gap-1.5">
          <Link href="/profil" className="hover:text-green-dk2">Tentang Kami</Link>
          <span>&rsaquo;</span>
          <Link href="/profil/komisi" className="hover:text-green-dk2">Bidang & Komisi</Link>
          <span>&rsaquo;</span>
          <span className="text-green-dk2 font-bold">{b.nama}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-16 py-10 md:py-14">
        <Link href="/profil/komisi" className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-green-dk hover:text-emerald mb-6">
          &larr; Kembali ke Daftar Bidang & Komisi
        </Link>

        <div className="text-[12px] font-bold uppercase tracking-wide text-emerald mb-3">
          Daftar Kepengurusan
        </div>
        <div className="border border-line rounded-lg overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="bg-cream text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                <th className="text-left px-5 py-3">Nama Lengkap</th>
                <th className="text-left px-5 py-3 w-48">Jabatan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-5 py-3 font-semibold text-ink">{r.nama}</td>
                  <td className="px-5 py-3 text-ink-soft">
                    {r.jabatan === "Anggota" ? (
                      r.jabatan
                    ) : (
                      <span className="text-emerald font-bold">{r.jabatan}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11.5px] text-ink-soft mt-6 leading-relaxed">
          Sumber: Surat Keputusan Dewan Pimpinan MUI Provinsi DKI Jakarta Nomor Kep-006/DP-P XI/II/2026 dan Surat
          Keputusan Dewan Pimpinan MUI Kota Administrasi Jakarta Timur Nomor Kep-001/DP-K 01/V/2026, Masa Khidmat
          2025 sampai 2030.
        </p>
      </div>
    </div>
  );
}
