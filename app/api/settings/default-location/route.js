// Public read-only endpoint: the fallback location (set by super admin in
// /admin/settings) used when a visitor hasn't granted geolocation yet/at all.
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { key: "default_location" } });
  if (!setting) {
    return Response.json({ ok: false });
  }
  return Response.json({ ok: true, ...setting.value });
}
