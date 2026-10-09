import PageHeader from "@/components/PageHeader";
export default function LoadingPage() {
  return <div aria-busy="true"><PageHeader title="Memuat halaman" variant="service" /><div className="site-container py-10"><p role="status" className="text-ink-soft mb-6">Sedang menyiapkan konten…</p><div aria-hidden="true" className="space-y-4"><div className="h-5 w-2/3 bg-line rounded"/><div className="h-5 w-full bg-line rounded"/><div className="h-5 w-1/2 bg-line rounded"/></div></div></div>;
}
