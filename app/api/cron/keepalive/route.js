// Dipanggil harian oleh Vercel Cron (lihat vercel.json) agar Supabase tidak auto-pause
// setelah 5 hari tanpa aktivitas database. Dilindungi CRON_SECRET agar tidak bisa
// dipanggil publik.
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("unauthorized", { status: 401 });
  }

  try {
    await prisma.$queryRaw`select 1`;
    return Response.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
