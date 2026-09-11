const SCHEDULE = [
  { label: "Imsak", time: "04:27" },
  { label: "Subuh", time: "04:37", active: true },
  { label: "Dzuhur", time: "11:56" },
  { label: "Ashar", time: "15:13" },
  { label: "Maghrib", time: "17:56" },
  { label: "Isya", time: "19:04" },
];

export default function PrayerScheduleBar() {
  return (
    <div className="relative bg-green-dk2 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="flex items-start gap-3 max-w-sm">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A524" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
        </div>
        <div>
          <div className="text-white font-extrabold text-[15px] md:text-[16px]">Jadwal Sholat DKI Jakarta</div>
          <p className="text-white/60 text-[12px] md:text-[12.5px] leading-relaxed mt-1">
            Menampilkan jadwal sholat fardu harian berdasarkan titik koordinat ibu kota. Diperbarui secara otomatis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 md:flex gap-2.5">
        {SCHEDULE.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl px-4 py-2.5 text-center min-w-[74px] ${
              s.active ? "bg-[#F5A524]" : "bg-white/10"
            }`}
          >
            <div className={`text-[10.5px] font-semibold ${s.active ? "text-green-dk2/80" : "text-emerald"}`}>
              {s.label}
            </div>
            <div className={`text-[15px] font-extrabold ${s.active ? "text-green-dk2" : "text-white"}`}>
              {s.time}
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label="Pilih lokasi"
        className="hidden md:flex absolute -bottom-6 left-6 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center hover:bg-cream transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B4D33" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      </button>
    </div>
  );
}
