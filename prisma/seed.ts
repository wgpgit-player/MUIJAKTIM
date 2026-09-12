import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { beritaList } from "../data/berita";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
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
        imageUrl: null,
        featured: !!b.featured,
        status: "PUBLISHED",
        publishedAt: new Date(b.date),
      },
    });
  }
  console.log(`Seeded ${beritaList.length} news items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
