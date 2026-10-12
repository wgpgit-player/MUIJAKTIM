import { prisma } from "@/lib/prisma";

// Render configured, in-date-range sponsor creatives only.
export default async function AdBanner({ placement }) {
  const now = new Date();
  let candidates = [];
  try {
    candidates = await prisma.advertisement.findMany({
      where: {
        placement,
        active: true,
        OR: [{ startAt: null }, { startAt: { lte: now } }],
        AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
      },
    });
  } catch {
    // A DB hiccup should never take down the page around it — hide the unconfigured slot.
    candidates = [];
  }

  if (candidates.length === 0) return null;

  const ad = candidates[Math.floor(Math.random() * candidates.length)];

  return (
    <a
      href={ad.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block rounded-lg overflow-hidden border border-line bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto object-cover" />
    </a>
  );
}
