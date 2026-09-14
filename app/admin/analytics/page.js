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

// "Kunjungan" (a visit/session, Shopify-style) is deduped by IP address — 1 IP = 1
// kunjungan no matter how many pages that visitor opens. Older rows written before the
// ip column existed fall back to the visitor_id cookie so historical data still counts.
const VISIT_KEY = `coalesce(ip, visitor_id)`;

export default async function AdminAnalyticsPage() {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const todayStart = startOfDay(0);
  const weekStart = startOfDay(6);
  const monthStart = startOfDay(29);

  const [
    pageViewsToday,
    pageViewsWeek,
    pageViewsMonth,
    visitsTodayRows,
    visitsWeekRows,
    visitsMonthRows,
    topPages,
    dailyRows,
    topUserRows,
    recentRows,
  ] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.$queryRawUnsafe(
      `select count(distinct ${VISIT_KEY})::int as count from page_views where created_at >= $1`,
      todayStart
    ),
    prisma.$queryRawUnsafe(
      `select count(distinct ${VISIT_KEY})::int as count from page_views where created_at >= $1`,
      weekStart
    ),
    prisma.$queryRawUnsafe(
      `select count(distinct ${VISIT_KEY})::int as count from page_views where created_at >= $1`,
      monthStart
    ),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: monthStart } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 12,
    }),
    prisma.$queryRawUnsafe(
      `select date_trunc('day', created_at) as day,
              count(*)::int as pageviews,
              count(distinct ${VISIT_KEY})::int as visits
       from page_views
       where created_at >= $1
       group by 1
       order by 1 desc
       limit 14`,
      monthStart
    ),
    prisma.$queryRawUnsafe(
      `select user_id, count(*)::int as views
       from page_views
       where user_id is not null and created_at >= $1
       group by user_id
       order by views desc
       limit 10`,
      monthStart
    ),
    prisma.pageView.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { userProfile: { select: { username: true, firstName: true, lastName: true } } },
    }),
  ]);

  const visitsToday = visitsTodayRows[0]?.count ?? 0;
  const visitsWeek = visitsWeekRows[0]?.count ?? 0;
  const visitsMonth = visitsMonthRows[0]?.count ?? 0;
  const pagesPerVisitMonth = visitsMonth > 0 ? (pageViewsMonth / visitsMonth).toFixed(1) : "0";

  const userIds = topUserRows.map((r) => r.user_id);
  const profiles = userIds.length
    ? await prisma.profile.findMany({ where: { id: { in: userIds } } })
    : [];
  const profileById = Object.fromEntries(profiles.map((p) => [p.id, p]));

  const maxDailyPageviews = Math.max(1, ...dailyRows.map((r) => r.pageviews));

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-1">Analitik</h1>
      <p className="text-[12.5px] text-ink-soft mb-6">
        &quot;Kunjungan&quot; dihitung unik per alamat IP (1 IP = 1 kunjungan), terpisah dari
        &quot;Page Views&quot; yang menghitung setiap halaman yang dibuka — sama seperti
        laporan traffic Shopify.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Kunjungan Hari Ini", value: visitsToday },
          { label: "Kunjungan 7 Hari", value: visitsWeek },
          { label: "Kunjungan 30 Hari", value: visitsMonth },
          { label: "Rata-rata Halaman / Kunjungan", value: pagesPerVisitMonth, isDecimal: true },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-line rounded-2xl p-5">
            <div className="text-[26px] font-extrabold text-green-dk2">
              {c.isDecimal ? c.value : Number(c.value).toLocaleString("id-ID")}
            </div>
            <div className="text-[12px] text-ink-soft font-semibold mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Page Views Hari Ini", value: pageViewsToday },
          { label: "Page Views 7 Hari", value: pageViewsWeek },
          { label: "Page Views 30 Hari", value: pageViewsMonth },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-line rounded-2xl p-4">
            <div className="text-[19px] font-extrabold text-ink">{c.value.toLocaleString("id-ID")}</div>
            <div className="text-[11.5px] text-ink-soft font-semibold mt-0.5">{c.label}</div>
          </div>
        ))}
        <div className="bg-cream/60 border border-dashed border-line rounded-2xl p-4 flex items-center">
          <p className="text-[11px] text-ink-soft leading-relaxed">
            Contoh: 1 orang buka 35 halaman = <strong>1 kunjungan</strong>, <strong>35 page views</strong>.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 mb-8">
        {/* Daily chart */}
        <div className="bg-white border border-line rounded-2xl p-5">
          <div className="text-[13.5px] font-bold text-ink mb-4">Traffic Harian (14 hari terakhir)</div>
          <div className="flex items-center gap-4 mb-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="w-2.5 h-2.5 rounded-full bg-green-dk2 inline-block" /> Page Views
            </span>
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="w-2.5 h-2.5 rounded-full bg-lime inline-block" /> Kunjungan (unik IP)
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {dailyRows.map((row) => (
              <div key={row.day.toISOString()} className="flex items-center gap-3">
                <div className="w-20 shrink-0 text-[11px] text-ink-soft">{formatDateID(row.day)}</div>
                <div className="flex-1 bg-cream rounded-full h-4 overflow-hidden relative">
                  <div
                    className="bg-green-dk2 h-full rounded-full absolute inset-y-0 left-0"
                    style={{ width: `${(row.pageviews / maxDailyPageviews) * 100}%` }}
                  />
                  <div
                    className="bg-lime h-1.5 rounded-full absolute left-0"
                    style={{ width: `${(row.visits / maxDailyPageviews) * 100}%`, top: "50%", transform: "translateY(-50%)" }}
                  />
                </div>
                <div className="w-20 shrink-0 text-right text-[11px] text-ink-soft">
                  <span className="font-bold text-ink">{row.pageviews}</span> / {row.visits}
                </div>
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
                    <td className="px-5 py-2.5 text-[11px] text-ink-soft whitespace-nowrap">{r.ip ?? "-"}</td>
                    <td className="px-5 py-2.5 text-[11.5px] text-ink-soft whitespace-nowrap">
                      {r.createdAt.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
                {recentRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-ink-soft">
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
