import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import { requireRole } from "@/lib/rbac";

export const metadata = { title: "Analitik — Admin MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

function startOfDay(daysAgo = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

export default async function AdminAnalyticsPage() {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const todayStart = startOfDay(0);
  const weekStart = startOfDay(6);
  const monthStart = startOfDay(29);

  const [viewsToday, viewsWeek, viewsMonth, totalViews, topPages, dailyRows, topUserRows, recentRows] =
    await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.pageView.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.pageView.count(),
      prisma.pageView.groupBy({
        by: ["path"],
        where: { createdAt: { gte: monthStart } },
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 12,
      }),
      prisma.$queryRaw`
        select date_trunc('day', created_at) as day,
               count(*)::int as views,
               count(distinct visitor_id)::int as visitors
        from page_views
        where created_at >= ${monthStart}
        group by 1
        order by 1 desc
        limit 14
      `,
      prisma.$queryRaw`
        select user_id, count(*)::int as views
        from page_views
        where user_id is not null and created_at >= ${monthStart}
        group by user_id
        order by views desc
        limit 10
      `,
      prisma.pageView.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { userProfile: { select: { username: true, firstName: true, lastName: true } } },
      }),
    ]);

  const userIds = topUserRows.map((r) => r.user_id);
  const profiles = userIds.length
    ? await prisma.profile.findMany({ where: { id: { in: userIds } } })
    : [];
  const profileById = Object.fromEntries(profiles.map((p) => [p.id, p]));

  const uniqueVisitorsMonth = await prisma.$queryRaw`
    select count(distinct visitor_id)::int as count from page_views where created_at >= ${monthStart}
  `;

  const maxDailyViews = Math.max(1, ...dailyRows.map((r) => r.views));

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Analitik</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Kunjungan Hari Ini", value: viewsToday },
          { label: "7 Hari Terakhir", value: viewsWeek },
          { label: "30 Hari Terakhir", value: viewsMonth },
          { label: "Pengunjung Unik (30 Hari)", value: uniqueVisitorsMonth[0]?.count ?? 0 },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-line rounded-2xl p-5">
            <div className="text-[26px] font-extrabold text-green-dk2">{c.value.toLocaleString("id-ID")}</div>
            <div className="text-[12px] text-ink-soft font-semibold mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 mb-8">
        {/* Daily chart */}
        <div className="bg-white border border-line rounded-2xl p-5">
          <div className="text-[13.5px] font-bold text-ink mb-4">Kunjungan Harian (14 hari terakhir)</div>
          <div className="flex flex-col gap-2">
            {dailyRows.map((row) => (
              <div key={row.day.toISOString()} className="flex items-center gap-3">
                <div className="w-20 shrink-0 text-[11px] text-ink-soft">{formatDateID(row.day)}</div>
                <div className="flex-1 bg-cream rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-dk2 h-full rounded-full"
                    style={{ width: `${(row.views / maxDailyViews) * 100}%` }}
                  />
                </div>
                <div className="w-14 shrink-0 text-right text-[11.5px] font-bold text-ink">{row.views}</div>
              </div>
            ))}
            {dailyRows.length === 0 && <p className="text-[13px] text-ink-soft">Belum ada data.</p>}
          </div>
        </div>

        {/* Top pages */}
        <div className="bg-white border border-line rounded-2xl p-5">
          <div className="text-[13.5px] font-bold text-ink mb-4">Halaman Paling Sering Diakses (30 hari)</div>
          <div className="flex flex-col divide-y divide-line">
            {topPages.map((p) => (
              <div key={p.path} className="py-2.5 flex items-center justify-between gap-3">
                <span className="text-[12.5px] text-ink truncate">{p.path}</span>
                <span className="text-[12px] font-bold text-green-dk2 shrink-0">{p._count.path}</span>
              </div>
            ))}
            {topPages.length === 0 && <p className="text-[13px] text-ink-soft">Belum ada data.</p>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_1.3fr] gap-6">
        {/* Top logged-in users */}
        <div className="bg-white border border-line rounded-2xl p-5">
          <div className="text-[13.5px] font-bold text-ink mb-4">Pengguna Login Paling Aktif (30 hari)</div>
          <div className="flex flex-col divide-y divide-line">
            {topUserRows.map((r) => {
              const p = profileById[r.user_id];
              return (
                <div key={r.user_id} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-[12.5px] text-ink truncate">
                    {p ? `${p.firstName} ${p.lastName} (@${p.username})` : r.user_id}
                  </span>
                  <span className="text-[12px] font-bold text-green-dk2 shrink-0">{r.views}</span>
                </div>
              );
            })}
            {topUserRows.length === 0 && (
              <p className="text-[13px] text-ink-soft">Belum ada pengguna login yang tercatat.</p>
            )}
          </div>
        </div>

        {/* Recent activity log */}
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <div className="px-5 py-4 text-[13.5px] font-bold text-ink border-b border-line">
            Aktivitas Terbaru
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-line">
                {recentRows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-2.5 text-[12.5px] text-ink truncate max-w-[180px]">{r.path}</td>
                    <td className="px-5 py-2.5 text-[12px] text-ink-soft">
                      {r.userProfile ? `@${r.userProfile.username}` : "Tamu"}
                    </td>
                    <td className="px-5 py-2.5 text-[11.5px] text-ink-soft whitespace-nowrap">
                      {r.createdAt.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
                {recentRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                      Belum ada aktivitas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
