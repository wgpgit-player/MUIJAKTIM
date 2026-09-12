import NewsSectionPage from "@/components/berita/NewsSectionPage";

export const metadata = { title: "Kabar Jakarta Timur — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <NewsSectionPage
      eyebrow="Berita & Opini"
      title="Kabar Jakarta Timur"
      description="Liputan acara, kegiatan, dan berita keagamaan lokal di wilayah Jakarta Timur."
      section="KABAR_JAKARTA_TIMUR"
    />
  );
}
