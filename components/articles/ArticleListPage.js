import { prisma } from "@/lib/prisma";

export default async function ArticleListPage({ eyebrow, title, description, section, basePath }) {
  const items = await prisma.article.findMany({
    where: { status: "PUBLISHED", section },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2">{eyebrow}</div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">{title}</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">{description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {items.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-[14px] text-ink-soft">Konten untuk bagian ini belum tersedia.</p>
            <p className="text-[12.5px] text-ink-soft/70 mt-2">Admin dapat menambahkannya lewat panel admin.</p>
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
