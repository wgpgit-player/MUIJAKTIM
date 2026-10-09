import PageHeader from "@/components/PageHeader";
export default function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="reading-container py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0F6B45" strokeWidth="2">
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <p className="text-[14.5px] text-ink-soft leading-relaxed">{description}</p>
        <p className="text-[13px] text-ink-soft/70 mt-4">Halaman ini sedang dalam tahap pengembangan berikutnya.</p>
      </div>
    </div>
  );
}
