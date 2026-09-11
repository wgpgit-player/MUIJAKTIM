export default function PageHeader({ eyebrow, title, desc }) {
  return (
    <div className="border-b border-line bg-cream px-5 pt-9 pb-7 md:px-16 md:pt-12 md:pb-9">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[11.5px] font-bold text-emerald mb-3">
          <span className="w-4 h-px bg-emerald" />
          {eyebrow}
        </div>
        <h1 className="text-[24px] md:text-[32px] font-extrabold text-green-dk2 tracking-tight leading-tight">
          {title}
        </h1>
        {desc && <p className="text-[13.5px] md:text-[14.5px] text-ink-soft leading-relaxed mt-3 max-w-2xl">{desc}</p>}
      </div>
    </div>
  );
}
