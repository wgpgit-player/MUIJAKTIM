import { prisma } from "@/lib/prisma";

export const metadata = { title: "Konsultasi Keluarga — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await prisma.pageContent.findUnique({ where: { key: "konsultasi-info" } });

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2">Layanan Umat</div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">
            {content?.title ?? "Konsultasi Keluarga"}
          </h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 md:px-16 py-16 text-center">
        <p className="text-[14.5px] text-ink-soft leading-relaxed">
          {content?.body ?? "Solusi seputar konflik rumah tangga, warisan, dan pernikahan."}
        </p>
      </div>
    </div>
  );
}
