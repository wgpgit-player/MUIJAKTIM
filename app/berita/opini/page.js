import NewsSectionPage from "@/components/berita/NewsSectionPage";

export const metadata = { title: "Opini Ulama — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <NewsSectionPage
      eyebrow="Berita & Opini"
      title="Opini Ulama"
      description="Tulisan dan pandangan ulama terkait isu-isu sosial-keagamaan terkini."
      section="OPINI_ULAMA"
    />
  );
}
