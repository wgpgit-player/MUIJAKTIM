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

async function main() {
  await seedNews();
  await seedFatwa();
  await seedFaq();
  await seedBidangKomisi();
  await seedPengurus();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
