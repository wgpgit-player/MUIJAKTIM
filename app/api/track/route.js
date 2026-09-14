// Lightweight first-party page-view logger. Called from components/Analytics.js on
// every client-side navigation. Captures the client IP (from the proxy headers Vercel
// sets) so the admin dashboard can count unique "kunjungan"/sessions the way Shopify's
// traffic report does (1 IP = 1 visit) while still keeping every individual page load
// as its own row for the separate page-view count.
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || null;
}

export async function POST(request) {
  try {
    const { path, referrer, visitorId, userAgent } = await request.json();
    if (!path || !visitorId) {
      return Response.json({ ok: false }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await prisma.pageView.create({
      data: {
        path: String(path).slice(0, 500),
        referrer: referrer ? String(referrer).slice(0, 500) : null,
        userAgent: userAgent ? String(userAgent).slice(0, 300) : null,
        visitorId: String(visitorId).slice(0, 100),
        ip: getClientIp(request),
        userId: user?.id ?? null,
      },
    });

    return Response.json({ ok: true });
  } catch (err) {
    // Tracking must never break the page it's embedded on.
    return Response.json({ ok: false, error: String(err) }, { status: 200 });
  }
}
