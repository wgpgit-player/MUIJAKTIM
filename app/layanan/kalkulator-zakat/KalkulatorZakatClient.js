"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const fmt = (n) =>
  isFinite(n) && !isNaN(n)
    ? "Rp " + Math.round(n).toLocaleString("id-ID")
    : "Rp 0";

const TABS = [
  { key: "fitrah", label: "Zakat Fitrah" },
  { key: "maal", label: "Zakat Maal" },
  { key: "emas", label: "Zakat Emas & Perak" },
  { key: "profesi", label: "Zakat Profesi" },
];

function NumberField({ label, suffix, value, onChange, hint, placeholder }) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-bold text-ink mb-1.5">{label}</span>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            onChange(raw);
          }}
          className="w-full rounded-xl border border-line px-4 py-3 text-[14px] font-semibold text-ink outline-none focus:border-green-dk transition-colors pr-16"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-ink-soft">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="block text-[11.5px] text-ink-soft mt-1.5 leading-snug">{hint}</span>}
    </label>
  );
}

function ResultCard({ wajib, nominal, detail }) {
  return (
    <div
      className={`rounded-2xl p-5 md:p-6 border ${
        wajib ? "bg-green-dk2 border-green-dk2" : "bg-cream border-line"
      }`}
    >
      <div className={`text-[11.5px] font-bold uppercase tracking-wide mb-1 ${wajib ? "text-lime" : "text-ink-soft"}`}>
        {wajib ? "Wajib Zakat" : "Belum Wajib Zakat"}
      </div>
      <div className={`text-[26px] md:text-[32px] font-extrabold ${wajib ? "text-white" : "text-ink"}`}>
        {fmt(nominal)}
      </div>
      {detail && (
        <div className={`text-[12.5px] mt-2 leading-relaxed ${wajib ? "text-white/75" : "text-ink-soft"}`}>
          {detail}
        </div>
      )}
    </div>
  );
}

// ── Zakat Fitrah ──────────────────────────────────────────────
function FitrahCalc() {
  const [hargaBeras, setHargaBeras] = useState("15000");
  const [jiwa, setJiwa] = useState("1");

  const harga = parseFloat(hargaBeras) || 0;
  const orang = parseInt(jiwa) || 0;
  const totalPerOrang = harga * 2.5; // 2.5 kg beras
  const total = totalPerOrang * orang;

  return (
    <div className="space-y-5">
      <NumberField
        label="Harga beras per kg"
        suffix="/ kg"
        value={hargaBeras}
        onChange={setHargaBeras}
        hint="Gunakan harga beras yang biasa dikonsumsi sehari-hari (bukan harga termurah)."
      />
      <NumberField label="Jumlah jiwa yang dizakati" value={jiwa} onChange={setJiwa} hint="Termasuk diri sendiri, anak, dan tanggungan." />
      <ResultCard
        wajib={total > 0}
        nominal={total}
        detail={`${orang || 0} jiwa × 2,5 kg × ${fmt(harga)} = zakat fitrah dalam bentuk uang. Bisa juga ditunaikan dengan beras 2,5 kg (setara ± 3,5 liter) per jiwa.`}
      />
    </div>
  );
}

// ── Zakat Maal ────────────────────────────────────────────────
function MaalCalc() {
  const [hargaEmas, setHargaEmas] = useState("1500000");
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");

  const emas = parseFloat(hargaEmas) || 0;
  const nisab = emas * 85; // 85 gram emas
  const hartaTotal = parseFloat(harta) || 0;
  const utangTotal = parseFloat(utang) || 0;
  const hartaBersih = Math.max(hartaTotal - utangTotal, 0);
  const wajib = hartaBersih >= nisab && nisab > 0;
  const zakat = wajib ? hartaBersih * 0.025 : 0;

  return (
    <div className="space-y-5">
      <NumberField
        label="Harga emas per gram saat ini"
        suffix="/ gram"
        value={hargaEmas}
        onChange={setHargaEmas}
        hint="Nisab zakat maal = 85 gram emas. Sesuaikan dengan harga emas terkini."
      />
      <NumberField
        label="Total harta (tabungan, deposito, investasi, dll)"
        value={harta}
        onChange={setHarta}
        placeholder="0"
        hint="Harta yang sudah dimiliki selama 1 tahun penuh (haul)."
      />
      <NumberField label="Utang jatuh tempo (opsional)" value={utang} onChange={setUtang} placeholder="0" hint="Dikurangkan dari total harta sebelum dihitung." />

      <div className="flex items-center justify-between text-[13px] bg-cream rounded-xl px-4 py-3 border border-line">
        <span className="text-ink-soft font-medium">Nisab (85 gram emas)</span>
        <span className="font-bold text-ink">{fmt(nisab)}</span>
      </div>

      <ResultCard
        wajib={wajib}
        nominal={zakat}
        detail={
          wajib
            ? `Harta bersih ${fmt(hartaBersih)} sudah mencapai nisab. Zakat = 2,5% × ${fmt(hartaBersih)}.`
            : `Harta bersih ${fmt(hartaBersih)} belum mencapai nisab (${fmt(nisab)}), sehingga belum wajib zakat maal.`
        }
      />
    </div>
  );
}

// ── Zakat Emas & Perak ───────────────────────────────────────
function EmasCalc() {
  const [jenis, setJenis] = useState("emas");
  const [hargaPerGram, setHargaPerGram] = useState("1500000");
  const [berat, setBerat] = useState("");

  const nisabGram = jenis === "emas" ? 85 : 595; // 85g emas / 595g perak
  const harga = parseFloat(hargaPerGram) || 0;
  const beratGram = parseFloat(berat) || 0;
  const wajib = beratGram >= nisabGram;
  const nilaiTotal = harga * beratGram;
  const zakat = wajib ? nilaiTotal * 0.025 : 0;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {[
          { key: "emas", label: "Emas (nisab 85 gr)" },
          { key: "perak", label: "Perak (nisab 595 gr)" },
        ].map((o) => (
          <button
            key={o.key}
            onClick={() => setJenis(o.key)}
            className={`flex-1 rounded-xl py-2.5 text-[12.5px] font-bold border transition-colors ${
              jenis === o.key ? "bg-green-dk2 text-white border-green-dk2" : "bg-white text-ink-soft border-line"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <NumberField
        label={`Harga ${jenis} per gram saat ini`}
        suffix="/ gram"
        value={hargaPerGram}
        onChange={setHargaPerGram}
      />
      <NumberField label={`Total berat ${jenis} yang disimpan`} suffix="gram" value={berat} onChange={setBerat} placeholder="0" hint="Perhiasan yang dipakai rutin umumnya tidak wajib dizakati, hanya yang disimpan sebagai simpanan." />

      <div className="flex items-center justify-between text-[13px] bg-cream rounded-xl px-4 py-3 border border-line">
        <span className="text-ink-soft font-medium">Nisab</span>
        <span className="font-bold text-ink">{nisabGram} gram</span>
      </div>

      <ResultCard
        wajib={wajib}
        nominal={zakat}
        detail={
          wajib
            ? `${beratGram} gram sudah mencapai nisab (${nisabGram} gram). Zakat = 2,5% × ${fmt(nilaiTotal)}.`
            : `${beratGram || 0} gram belum mencapai nisab (${nisabGram} gram), sehingga belum wajib zakat.`
        }
      />
    </div>
  );
}

// ── Zakat Profesi ────────────────────────────────────────────
function ProfesiCalc() {
  const [periode, setPeriode] = useState("bulanan");
  const [hargaBeras, setHargaBeras] = useState("15000");
  const [penghasilan, setPenghasilan] = useState("");
  const [kebutuhan, setKebutuhan] = useState("");

  const beras = parseFloat(hargaBeras) || 0;
  // Nisab zakat profesi: setara 522 kg beras / tahun (ijtihad kontemporer), dikonversi per periode
  const nisabTahun = beras * 522;
  const nisab = periode === "bulanan" ? nisabTahun / 12 : nisabTahun;

  const penghasilanTotal = parseFloat(penghasilan) || 0;
  const kebutuhanTotal = parseFloat(kebutuhan) || 0;
  const penghasilanBersih = Math.max(penghasilanTotal - kebutuhanTotal, 0);
  const wajib = penghasilanBersih >= nisab && nisab > 0;
  const zakat = wajib ? penghasilanBersih * 0.025 : 0;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {[
          { key: "bulanan", label: "Per Bulan" },
          { key: "tahunan", label: "Per Tahun" },
        ].map((o) => (
          <button
            key={o.key}
            onClick={() => setPeriode(o.key)}
            className={`flex-1 rounded-xl py-2.5 text-[12.5px] font-bold border transition-colors ${
              periode === o.key ? "bg-green-dk2 text-white border-green-dk2" : "bg-white text-ink-soft border-line"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <NumberField label="Harga beras per kg" suffix="/ kg" value={hargaBeras} onChange={setHargaBeras} hint="Dipakai untuk menghitung nisab setara 522 kg beras per tahun." />
      <NumberField
        label={`Penghasilan ${periode === "bulanan" ? "bulanan" : "tahunan"} (gaji, honor, dll)`}
        value={penghasilan}
        onChange={setPenghasilan}
        placeholder="0"
      />
      <NumberField label="Kebutuhan pokok (opsional)" value={kebutuhan} onChange={setKebutuhan} placeholder="0" hint="Kebutuhan primer yang wajar dapat dikurangkan sebelum dihitung." />

      <div className="flex items-center justify-between text-[13px] bg-cream rounded-xl px-4 py-3 border border-line">
        <span className="text-ink-soft font-medium">Nisab ({periode === "bulanan" ? "per bulan" : "per tahun"})</span>
        <span className="font-bold text-ink">{fmt(nisab)}</span>
      </div>

      <ResultCard
        wajib={wajib}
        nominal={zakat}
        detail={
          wajib
            ? `Penghasilan bersih ${fmt(penghasilanBersih)} sudah mencapai nisab. Zakat = 2,5% × ${fmt(penghasilanBersih)}.`
            : `Penghasilan bersih ${fmt(penghasilanBersih)} belum mencapai nisab (${fmt(nisab)}).`
        }
      />
    </div>
  );
}

export default function KalkulatorZakatClient() {
  const [tab, setTab] = useState("fitrah");

  const ActiveCalc = useMemo(() => {
    switch (tab) {
      case "fitrah":
        return <FitrahCalc />;
      case "maal":
        return <MaalCalc />;
      case "emas":
        return <EmasCalc />;
      case "profesi":
        return <ProfesiCalc />;
      default:
        return null;
    }
  }, [tab]);

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] md:text-[12.5px] text-lime font-bold mb-2 flex items-center gap-1.5 flex-wrap">
            <Link href="/layanan" className="hover:underline">Layanan Umat</Link>
            <span>&rsaquo;</span>
            <span>Kalkulator Zakat</span>
          </div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">Kalkulator Zakat</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">
            Hitung kewajiban zakat fitrah, maal, emas/perak, dan profesi sesuai ketentuan syariat. Hasil bersifat
            estimasi. Konsultasikan kasus khusus ke tim fatwa MUI Jakarta Timur.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-bold border transition-colors ${
                tab === t.key
                  ? "bg-green-dk2 text-white border-green-dk2"
                  : "bg-white text-ink-soft border-line hover:border-green-dk"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-line p-5 md:p-7 shadow-[0_8px_24px_-8px_rgba(11,77,51,0.12)]">
          {ActiveCalc}
        </div>

        <p className="text-[11.5px] text-ink-soft text-center mt-6 leading-relaxed">
          Perhitungan menggunakan kaidah fikih zakat kontemporer (nisab 85 gr emas / 522 kg beras). Untuk penyaluran
          zakat, hubungi{" "}
          <Link href="/layanan" className="text-green-dk font-bold hover:underline">
            Layanan Umat MUI Jakarta Timur
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
