// Dummy placement untuk slot iklan/sponsor — menggantikan posisi Jadwal Sholat yang sudah
// dipindah ke bar utilitas atas. Ukuran mengikuti standar banner leaderboard (970x90 desktop,
// 320x100 mobile). Ganti isinya dengan kode/gambar iklan sungguhan saat sudah ada sponsor.
export default function AdBannerPlaceholder() {
  return (
    <div className="border-2 border-dashed border-line rounded-lg bg-white/60 flex flex-col items-center justify-center text-center py-6 md:py-5 px-5 gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft/70">Ruang Iklan / Sponsor</span>
      <span className="text-[12.5px] text-ink-soft/60">970 &times; 90, hubungi kami untuk beriklan di sini</span>
    </div>
  );
}
