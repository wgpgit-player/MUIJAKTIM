import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Konsultasi Keluarga — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await prisma.pageContent.findUnique({ where: { key: "konsultasi-info" } });

  return (
    <div>
      <PageHeader variant="service" title={content?.title ?? "Konsultasi Keluarga"} breadcrumbs={[{label:"Layanan Umat",href:"/layanan"}]} />
      <div className="reading-container py-16 text-center">
        <p className="text-[14.5px] text-ink-soft leading-relaxed">
          {content?.body ?? "Solusi seputar konflik rumah tangga, warisan, dan pernikahan."}
        </p>
      </div>
    </div>
  );
}
