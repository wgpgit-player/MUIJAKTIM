import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { beritaList } from "../data/berita";
import { FATWA_LIST } from "../app/fatwa/fatwa-data";
import { FAQ } from "../app/layanan/tanya-ulama/faq-data";
import { BIDANG_LIST, PIMPINAN_INTI, DEWAN_PERTIMBANGAN } from "../app/profil/bidang-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PERIOD = "2025-2030";

const FATWA_CATEGORY_MAP: Record<string, "IBADAH_KESEHATAN" | "MUAMALAH" | "DIREKTORI_KONTEMPORER"> = {
  ibadah: "IBADAH_KESEHATAN",
  muamalah: "MUAMALAH",
  kontemporer: "DIREKTORI_KONTEMPORER",
};

const BULAN: Record<string, number> = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
};

function parseIndoDate(s: string): Date {
  const [day, month, year] = s.toLowerCase().trim().split(/\s+/);
  const m = BULAN[month];
  if (m === undefined) return new Date(s);
  return new Date(parseInt(year, 10), m, parseInt(day, 10));
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedNews() {
  for (const b of beritaList) {
    await prisma.news.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        title: b.title,
        category: b.category,
        excerpt: b.excerpt,
        body: b.excerpt,
        featured: !!b.featured,
        status: "PUBLISHED",
        publishedAt: new Date(b.date),
      },
    });
  }
  console.log(`Seeded ${beritaList.length} news items.`);
}

async function seedFatwa() {
  for (const f of FATWA_LIST) {
    const slug = slugify(`${f.number}-${f.title}`);
    await prisma.fatwa.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        number: f.number,
        title: f.title,
        category: FATWA_CATEGORY_MAP[f.category] ?? "DIREKTORI_KONTEMPORER",
        body: "Dokumen resmi fatwa MUI Pusat. Lihat berkas PDF untuk teks lengkap.",
        pdfUrl: f.pdfUrl,
        publishedAt: parseIndoDate(f.date),
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Seeded ${FATWA_LIST.length} fatwa items.`);
}

async function seedFaq() {
  for (let i = 0; i < FAQ.length; i++) {
    const item = FAQ[i];
    const existing = await prisma.faqTanyaUlama.findFirst({ where: { question: item.q } });
    if (existing) continue;
    await prisma.faqTanyaUlama.create({
      data: {
        question: item.q,
        answer: item.a,
        category: "Fikih Sehari-hari",
        keywords: item.keywords,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Seeded ${FAQ.length} FAQ items.`);
}

async function seedBidangKomisi() {
  for (const b of BIDANG_LIST) {
    await prisma.bidangKomisi.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        name: b.nama,
        description: `${b.nama} MUI Jakarta Timur masa khidmat ${PERIOD}.`,
        chairName: b.ketua,
        secretaryName: b.sekretaris,
        members: b.anggota,
      },
    });
  }
  console.log(`Seeded ${BIDANG_LIST.length} bidang/komisi items.`);
}

async function seedPengurus() {
  let sortOrder = 0;
  for (const p of PIMPINAN_INTI) {
    const existing = await prisma.pengurus.findFirst({ where: { name: p.nama, position: p.jabatan } });
    if (!existing) {
      await prisma.pengurus.create({
        data: { name: p.nama, position: p.jabatan, period: PERIOD, sortOrder: sortOrder++ },
      });
    }
  }

  const dewan: { name: string; position: string }[] = [
    { name: DEWAN_PERTIMBANGAN.ketua, position: "Ketua Dewan Pertimbangan" },
    { name: DEWAN_PERTIMBANGAN.wakilKetua, position: "Wakil Ketua Dewan Pertimbangan" },
    { name: DEWAN_PERTIMBANGAN.sekretaris, position: "Sekretaris Dewan Pertimbangan" },
    ...DEWAN_PERTIMBANGAN.anggota.map((name) => ({ name, position: "Anggota Dewan Pertimbangan" })),
  ];
  for (const d of dewan) {
    const existing = await prisma.pengurus.findFirst({ where: { name: d.name, position: d.position } });
    if (!existing) {
      await prisma.pengurus.create({
        data: { name: d.name, position: d.position, period: PERIOD, sortOrder: sortOrder++ },
      });
    }
  }
  console.log(`Seeded ${PIMPINAN_INTI.length + dewan.length} pengurus items.`);
}

async function seedHeroSlides() {
  const existing = await prisma.heroSlide.count();
  if (existing > 0) {
    console.log("Hero slides already seeded, skipping.");
    return;
  }
  for (let i = 1; i <= 8; i++) {
    await prisma.heroSlide.create({
      data: {
        imageUrl: `/hero/slide-${i}.jpg`,
        title: `Slide ${i}`,
        sortOrder: i - 1,
        active: true,
      },
    });
  }
  console.log("Seeded 8 hero slide items.");
}

const PAGE_CONTENT: { key: string; title: string; body: string }[] = [
  {
    key: "sejarah",
    title: "Sejarah Majelis Ulama Indonesia",
    body: [
      "Kelahiran Majelis Ulama Indonesia (MUI) Provinsi DKI Jakarta termasuk unik. Ia lahir pada tanggal 13 Februari 1975, sekitar lima bulan lebih awal dibanding MUI Pusat yang lahir pada 17 Rajab 1395 H, bertepatan dengan 26 Juli 1975. Meski lahir mendahului organisasi induknya, MUI Provinsi DKI Jakarta tetap berhubungan secara organisatoris dan historis dengan MUI Pusat.",
      "Pendirian MUI dilatarbelakangi kesadaran kolektif umat Islam bahwa Indonesia memerlukan landasan kokoh bagi pembangunan masyarakat yang maju dan berakhlak. Sebelum MUI resmi berdiri, serangkaian pertemuan ulama dan tokoh Islam digelar untuk mematangkan gagasan sebuah majelis ulama yang menjalankan fungsi ijtihad kolektif serta memberi nasihat keagamaan kepada pemerintah dan masyarakat, di antaranya konferensi Pusat Dakwah Islam pada 30 September sampai 4 Oktober 1970 dan lokakarya mubaligh nasional pada 26 sampai 29 November 1974.",
      "Puncaknya, pada tanggal 21 sampai 27 Juli 1975 digelar Musyawarah Nasional Majelis Ulama Indonesia di Jakarta, dihadiri utusan majelis ulama daerah, pengurus pusat organisasi Islam, ulama independen, dan wakil ABRI. Lima puluh tiga peserta menandatangani deklarasi pendirian MUI. Mengikuti semangat itu, pada Mei 1975 hampir seluruh daerah tingkat Kabupaten dan Provinsi, termasuk Jakarta Timur, turut membentuk Majelis Ulama di wilayahnya masing-masing.",
    ].join("\n\n"),
  },
  {
    key: "visi",
    title: "Visi",
    body: "Terwujudnya umat Islam Jakarta Timur yang berakhlak mulia, moderat, dan berdaya, di bawah bimbingan ulama yang amanah.",
  },
  {
    key: "misi",
    title: "Misi",
    body: [
      "Menjadi rujukan fatwa dan bimbingan keagamaan yang kredibel bagi umat.",
      "Menguatkan ukhuwah islamiyah dan moderasi beragama di tengah masyarakat.",
      "Menjadi mitra strategis pemerintah dalam pembinaan kehidupan beragama.",
    ].join("\n"),
  },
  {
    key: "konsultasi-info",
    title: "Konsultasi Keluarga",
    body: "Layanan konsultasi keluarga MUI Jakarta Timur sedang disiapkan. Untuk sementara, silakan hubungi Sekretariat MUI Jakarta Timur untuk permohonan konsultasi.",
  },
];

async function seedPageContent() {
  for (const p of PAGE_CONTENT) {
    await prisma.pageContent.upsert({
      where: { key: p.key },
      update: {},
      create: p,
    });
  }
  console.log(`Seeded ${PAGE_CONTENT.length} page_content items.`);
}

const QUICK_ICONS: {
  label: string;
  iconUrl: string;
  linkUrl: string;
  sortOrder: number;
  showOnDesktop: boolean;
  description?: string;
}[] = [
  { label: "Jadwal Shalat", iconUrl: "/icons/jadwal-shalat.png", linkUrl: "/layanan/jadwal-shalat", sortOrder: 0, showOnDesktop: false },
  { label: "Kiblat", iconUrl: "/icons/kiblat.png", linkUrl: "/layanan/jadwal-shalat", sortOrder: 1, showOnDesktop: false },
  { label: "Kalender Hijriah", iconUrl: "/icons/kalender-hijriah.png", linkUrl: "/kalender", sortOrder: 2, showOnDesktop: false },
  { label: "Fiqih & Fatwa", iconUrl: "/icons/fatwa.png", linkUrl: "/fatwa", sortOrder: 3, showOnDesktop: true, description: "Kumpulan fatwa MUI" },
  { label: "Berita", iconUrl: "/icons/berita.png", linkUrl: "/berita", sortOrder: 4, showOnDesktop: false },
  { label: "Layanan Umat", iconUrl: "/icons/layanan-umat.png", linkUrl: "/layanan/tanya-ulama", sortOrder: 5, showOnDesktop: true, description: "Jawaban dari ulama" },
  { label: "Profil & Pimpinan", iconUrl: "/icons/profil-pimpinan.png", linkUrl: "/profil?tab=pengurus", sortOrder: 6, showOnDesktop: true, description: "Pimpinan MUI Jaktim" },
  { label: "Login Anggota", iconUrl: "/icons/login-anggota.png", linkUrl: "/login", sortOrder: 7, showOnDesktop: false },
];

async function seedQuickIcons() {
  const existing = await prisma.quickIcon.count();
  if (existing > 0) {
    console.log("Quick icons already seeded, skipping.");
    return;
  }
  for (const item of QUICK_ICONS) {
    await prisma.quickIcon.create({
      data: {
        label: item.label,
        iconUrl: item.iconUrl,
        linkUrl: item.linkUrl,
        description: item.description ?? null,
        sortOrder: item.sortOrder,
        showOnDesktop: item.showOnDesktop,
        showOnMobile: true,
        active: true,
      },
    });
  }
  console.log(`Seeded ${QUICK_ICONS.length} quick_icons items.`);
}

// Kalkulator Zakat kept as a 4th desktop highlight card even though it's not in the
// mobile icon grid (original MobileQuickAccess list didn't include it either).
async function seedKalkulatorZakatIcon() {
  const existing = await prisma.quickIcon.findFirst({ where: { linkUrl: "/layanan/kalkulator-zakat" } });
  if (existing) return;
  await prisma.quickIcon.create({
    data: {
      label: "Kalkulator Zakat",
      iconUrl: "/icons/kalkulator-zakat.png",
      linkUrl: "/layanan/kalkulator-zakat",
      description: "Hitung zakat Anda",
      sortOrder: 3,
      showOnDesktop: true,
      showOnMobile: false,
      active: true,
    },
  });
  console.log("Seeded kalkulator-zakat quick icon.");
}

async function main() {
  await seedNews();
  await seedFatwa();
  await seedFaq();
  await seedBidangKomisi();
  await seedPengurus();
  await seedHeroSlides();
  await seedQuickIcons();
  await seedKalkulatorZakatIcon();
  await seedPageContent();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
