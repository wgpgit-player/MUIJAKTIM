import PageHeader from "@/components/PageHeader";
import TopicList from "@/components/TopicList";

export const metadata = { title: "Kitab — MUI Jakarta Timur" };

const items = [
  {
    code: "4.a",
    title: "Al-Qur'an",
    desc: "Al-Qur'an digital lengkap dengan terjemah, tajwid, dan tafsir ringkas, dapat dibaca langsung dari browser.",
  },
  {
    code: "4.b",
    title: "Turats (Kitab-kitab)",
    desc: "Direktori rujukan dan terjemahan kitab-kitab klasik (turats), tersusun per kategori dan disiplin ilmu (salaf & khalaf).",
  },
  {
    code: "4.c",
    title: "Kamus",
    desc: "Kamus Arab-Indonesia, Inggris-Indonesia & glosarium istilah teknis bahasa Arab, memudahkan pencarian makna kata dalam kitab.",
  },
];

export default function KitabPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Kitab"
        title="Literatur & Referensi Digital"
        desc="Fasilitas literatur dan referensi digital bagi umat, dari Al-Qur'an, rujukan kitab, hingga kamus istilah."
      />

      <div className="max-w-7xl mx-auto px-5 md:px-16 py-10 md:py-14">
        <TopicList items={items} />
      </div>
    </div>
  );
}
