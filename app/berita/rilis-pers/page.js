import NewsSectionPage from "@/components/berita/NewsSectionPage";

export const metadata = { title: "Rilis Pers / Maklumat — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <NewsSectionPage
      eyebrow="Berita & Opini"
      title="Rilis Pers / Maklumat"
      description="Dokumen pernyataan sikap, himbauan, atau pengumuman resmi MUI Jakarta Timur."
      section="RILIS_PERS"
    />
  );
}
