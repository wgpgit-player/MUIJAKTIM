import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteNews } from "./actions";

export const metadata = { title: "Kelola Berita — Admin MUI Jakarta Timur" };

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Berita</h1>
        <Link
          href="/admin/news/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Berita Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {news.map((n) => (
              <tr key={n.id}>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink max-w-[280px] truncate">
                  {n.title}
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{n.category}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      n.status === "PUBLISHED" ? "bg-emerald/15 text-green-dk2" : "bg-ink-soft/15 text-ink-soft"
                    }`}
                  >
                    {n.status === "PUBLISHED" ? "Tayang" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{formatDateID(n.createdAt)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/news/${n.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteNews.bind(null, n.id)}
                    confirmText={`Hapus berita "${n.title}"? Tindakan ini tidak dapat dibatalkan.`}
                  />
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada berita. Klik &quot;+ Berita Baru&quot; untuk menambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
