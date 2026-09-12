import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Halaman Statis — Admin MUI Jakarta Timur" };

const LABELS = {
  sejarah: "Sejarah (tab Profil)",
  visi: "Visi (tab Profil)",
  misi: "Misi (tab Profil)",
  "konsultasi-info": "Info Konsultasi Keluarga",
};

export default async function AdminPageContentPage() {
  const items = await prisma.pageContent.findMany({ orderBy: { key: "asc" } });

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-2">Halaman Statis</h1>
      <p className="text-[13px] text-ink-soft mb-6">
        Teks blok tunggal yang tampil di halaman publik (Sejarah, Visi &amp; Misi, info Konsultasi).
      </p>

      <div className="bg-white border border-line rounded-2xl divide-y divide-line">
        {items.map((p) => (
          <div key={p.key} className="px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-bold text-ink">{LABELS[p.key] ?? p.key}</div>
              <div className="text-[12px] text-ink-soft mt-0.5 truncate max-w-md">{p.body}</div>
            </div>
            <Link
              href={`/admin/page-content/${p.key}`}
              className="text-[12.5px] font-bold text-green-dk hover:underline shrink-0 ml-4"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
