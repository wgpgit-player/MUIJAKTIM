import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteBidangKomisi } from "./actions";

export const metadata = { title: "Kelola Bidang/Komisi — Admin MUI Jakarta Timur" };

export default async function AdminBidangKomisiPage() {
  const items = await prisma.bidangKomisi.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Bidang/Komisi</h1>
        <Link
          href="/admin/bidang-komisi/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Bidang Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Ketua</th>
              <th className="px-5 py-3">Jumlah Anggota</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((b) => (
              <tr key={b.id}>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{b.name}</td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{b.chairName ?? "-"}</td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">
                  {Array.isArray(b.members) ? b.members.length : 0}
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/bidang-komisi/${b.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteBidangKomisi.bind(null, b.id)}
                    confirmText={`Hapus bidang "${b.name}"?`}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada data bidang/komisi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
