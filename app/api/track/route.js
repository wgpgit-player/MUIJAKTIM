// Lightweight first-party page-view logger. Called from components/Analytics.js on
// every client-side navigation. Deliberately does NOT store IP addresses — visitors
// are distinguished only by a random id in a first-party cookie, which is enough to
// answer "how many distinct visitors / which logged-in users" without being invasive.
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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
        userId: user?.id ?? null,
      },
    });

    return Response.json({ ok: true });
  } catch (err) {
    // Tracking must never break the page it's embedded on.
    return Response.json({ ok: false, error: String(err) }, { status: 200 });
  }
}
