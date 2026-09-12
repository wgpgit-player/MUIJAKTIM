import { prisma } from "@/lib/prisma";

// Picks one active, in-date-range ad at random for the given placement (simple fairness
// when a sponsor has more than one creative running). Falls back to a dashed "ruang
// iklan" placeholder if the slot has nothing configured yet — never renders blank.
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
    // A DB hiccup should never take down the page around it — fall through to placeholder.
    candidates = [];
  }

  if (candidates.length === 0) {
    return (
      <div className="border-2 border-dashed border-line rounded-lg bg-white/60 flex flex-col items-center justify-center text-center py-6 md:py-5 px-5 gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft/70">Ruang Iklan / Sponsor</span>
        <span className="text-[12.5px] text-ink-soft/60">970 &times; 90, hubungi kami untuk beriklan di sini</span>
      </div>
    );
  }

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
