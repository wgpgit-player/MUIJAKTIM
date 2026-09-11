import PageHeader from "@/components/PageHeader";
import TopicList from "@/components/TopicList";

export const metadata = { title: "Amalan — MUI Jakarta Timur" };

const items = [
  {
    code: "6.a",
    title: "Fiqih Wanita (Muslimah)",
    desc: "Hukum syariat khusus perempuan (haid, aurat, dan perhiasan) dijelaskan secara ringkas dan mudah dipahami.",
  },
  {
    code: "6.b",
    title: "Parenting Islami",
    desc: "Tips mendidik anak dan membangun keluarga harmonis sesuai sunnah, dari pola asuh hingga komunikasi keluarga.",
  },
  {
    code: "6.c",
    title: "Doa & Dzikir",
    desc: "Kumpulan doa harian untuk berbagai momen tertentu, dilengkapi lafal Arab, latin, dan terjemahan.",
  },
  {
    code: "6.d",
    title: "Teks Khutbah Jumat",
    desc: "Bank naskah khutbah berkualitas dan menyejukkan, siap pakai bagi khatib di masjid-masjid Jakarta Timur.",
  },
  {
    code: "6.e",
    title: "Hikmah & Akhlak",
    desc: "Kisah teladan, nasehat bijak, dan materi penyucian jiwa untuk memperkuat akhlak dan spiritualitas umat.",
  },
];

export default function AmalanPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Amalan"
        title="Materi Pendukung Rutinitas Spiritual"
        desc="Fiqih wanita, parenting islami, doa, dzikir, naskah khutbah, dan hikmah untuk menguatkan amalan harian umat."
      />

      <div className="max-w-7xl mx-auto px-5 md:px-16 py-10 md:py-14">
        <TopicList items={items} />
      </div>
    </div>
  );
}
