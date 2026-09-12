// Public read-only endpoint for the floating chat widget's "Chat Admin" WhatsApp link.
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

const FALLBACK = { number: "6281233881973", message: "Assalamu'alaikum, saya ingin bertanya tentang..." };

export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { key: "whatsapp_contact" } });
  return Response.json({ ok: true, ...(setting?.value ?? FALLBACK) });
}
