import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard Admin — MUI Jakarta Timur" };

async function getCounts() {
  const [news, fatwa, faq, comments] = await Promise.all([
    prisma.news.count(),
    prisma.fatwa.count(),
    prisma.faqTanyaUlama.count(),
    prisma.comment.count({ where: { isDeleted: false } }),
  ]);
  return { news, fatwa, faq, comments };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    { label: "Berita", value: counts.news, href: "/admin/news" },
    { label: "Fatwa", value: counts.fatwa, href: "/admin/fatwa" },
    { label: "Tanya Ulama", value: counts.faq, href: "/admin/faq" },
    { label: "Komentar Aktif", value: counts.comments, href: "/admin/comments" },
  ];

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="bg-white border border-line rounded-2xl p-5 hover:border-emerald/40 transition-colors"
          >
            <div className="text-[28px] font-extrabold text-green-dk2">{c.value}</div>
            <div className="text-[12.5px] text-ink-soft font-semibold mt-1">{c.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
