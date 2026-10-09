"use client";
import PageHeader from "@/components/PageHeader";
export default function ErrorPage({ reset }) {
  return <div><PageHeader title="Halaman belum dapat dimuat" variant="service" /><div className="reading-container py-12"><p className="text-ink-soft mb-6">Terjadi gangguan saat memuat data. Silakan coba lagi atau kembali ke Beranda.</p><div className="flex flex-wrap gap-4"><button onClick={reset} className="rounded-lg bg-green-dk2 text-white px-5 py-3">Coba lagi</button><a href="/" className="underline px-3 py-3">Kembali ke Beranda</a></div></div></div>;
}
