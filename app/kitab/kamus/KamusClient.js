"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const LABEL = { id: "Indonesia", ar: "Arab" };

export default function KamusClient() {
  const [from, setFrom] = useState("id");
  const [to, setTo] = useState("ar");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setStatus("idle");
      return;
    }
    setStatus("loading");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/dictionary/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input, from, to }),
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json();
        if (data.ok) {
          setOutput(data.translated);
          setStatus("done");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [input, from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
    setInput(output);
    setOutput(input);
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2 flex items-center gap-1.5">
            <Link href="/kitab" className="hover:underline">Kitab</Link>
            <span>&rsaquo;</span>
            <span>Kamus Arab-Indonesia</span>
          </div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">Kamus Arab-Indonesia</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">
            Terjemahan cepat Indonesia &harr; Arab untuk membantu memahami istilah keislaman.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="bg-white rounded-2xl border border-line overflow-hidden">
          {/* Selector bahasa */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="text-[13px] font-bold text-ink">{LABEL[from]}</span>
            <button
              onClick={swap}
              aria-label="Tukar arah bahasa"
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-green-dk hover:bg-cream transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 7h13l-4-4M17 17H4l4 4" />
              </svg>
            </button>
            <span className="text-[13px] font-bold text-ink">{LABEL[to]}</span>
          </div>

          {/* Input & output */}
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line">
            <div className="p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                dir={from === "ar" ? "rtl" : "ltr"}
                placeholder={from === "ar" ? "اكتب هنا…" : "Ketik di sini…"}
                rows={6}
                maxLength={500}
                className={`w-full resize-none outline-none text-[15px] text-ink placeholder:text-ink-soft/60 ${
                  from === "ar" ? "font-arabic text-[19px] text-right" : ""
                }`}
              />
              <div className="text-[11px] text-ink-soft text-right mt-1">{input.length}/500</div>
            </div>
            <div className="p-4 bg-cream/40">
              {status === "loading" && <div className="text-[13px] text-ink-soft">Menerjemahkan…</div>}
              {status === "error" && (
                <div className="text-[13px] text-ink-soft">
                  Gagal menerjemahkan. Coba lagi sebentar.
                </div>
              )}
              {(status === "done" || status === "idle") && (
                <p
                  dir={to === "ar" ? "rtl" : "ltr"}
                  className={`text-[15px] text-ink leading-relaxed ${to === "ar" ? "font-arabic text-[19px] text-right" : ""}`}
                >
                  {output || <span className="text-ink-soft/50">Terjemahan akan muncul di sini…</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11.5px] text-ink-soft text-center mt-5 leading-relaxed">
          Terjemahan otomatis, disarankan sebagai bantuan awal saja — untuk istilah keagamaan
          yang presisi, rujuk Kamus Istilah atau tanyakan langsung ke tim MUI Jakarta Timur.
        </p>
      </div>
    </div>
  );
}
