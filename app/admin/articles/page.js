import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteArticle } from "./actions";

export const metadata = { title: "Kelola Artikel — Admin MUI Jakarta Timur" };

const SECTION_LABEL = {
  DOA_DZIKIR: "Doa & Dzikir",
  HIKMAH_AKHLAK: "Hikmah & Akhlak",
  KHUTBAH_JUMAT: "Khutbah Jumat",
  FIQIH_WANITA: "Fiqih Wanita",
  PARENTING: "Parenting",
  KITAB_KAMUS: "Kamus Istilah",
  KITAB_TURATS: "Turats",
};

export default async function AdminArticlesPage() {
  const items = await prisma.article.findMany({ orderBy: [{ section: "asc" }, { sortOrder: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Artikel</h1>
        <Link
          href="/admin/articles/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Artikel Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Bagian</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink max-w-[280px] truncate">{a.title}</td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{SECTION_LABEL[a.section]}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      a.status === "PUBLISHED" ? "bg-emerald/15 text-green-dk2" : "bg-ink-soft/15 text-ink-soft"
                    }`}
                  >
                    {a.status === "PUBLISHED" ? "Tayang" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{formatDateID(a.createdAt)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/articles/${a.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteArticle.bind(null, a.id)}
                    confirmText={`Hapus artikel "${a.title}"?`}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
