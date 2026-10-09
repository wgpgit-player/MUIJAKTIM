import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function ArticleListPage({ eyebrow, title, description, section, basePath }) {
  const items = await prisma.article.findMany({
    where: { status: "PUBLISHED", section },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <PageHeader title={title} desc={description} />

      <div className="site-container py-10 md:py-14">
        {items.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-[14px] text-ink-soft">Konten untuk bagian ini belum tersedia.</p>
            <a href="/" className="inline-block mt-3 underline">Kembali ke Beranda</a>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-line border-t border-b border-line">
            {items.map((item) => (
              <a
                key={item.slug}
                href={`${basePath}/${item.slug}`}
                className="py-5 flex flex-col gap-1 hover:bg-cream/60 transition-colors -mx-2 px-2 rounded-lg"
              >
                <div className="font-extrabold text-[15.5px] text-green-dk2">{item.title}</div>
                {item.excerpt && <p className="text-[13.5px] text-ink-soft leading-relaxed">{item.excerpt}</p>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
