import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";
export default function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="reading-container py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-5">
          <Icon name="document-text-outline" size={20}/>
        </div>
        <p className="text-[14.5px] text-ink-soft leading-relaxed">{description}</p>
        <p className="text-[13px] text-ink-soft/70 mt-4">Halaman ini sedang dalam tahap pengembangan berikutnya.</p>
      </div>
    </div>
  );
}
