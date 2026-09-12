"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { searchFaq } from "@/lib/searchFaq";

const WELCOME = {
  role: "bot",
  text:
    "Assalamu'alaikum. Saya asisten tanya-jawab fikih sehari-hari MUI Jakarta Timur. Silakan tulis pertanyaan Anda (mis. \"kapan waktu bayar zakat fitrah\"), atau pilih salah satu pertanyaan populer di bawah.",
};

export default function TanyaUlamaClient({ faqList }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = (question) => {
    const q = question.trim();
    if (!q) return;
    const results = searchFaq(q, faqList);
    const botMsg =
      results.length > 0
        ? {
            role: "bot",
            text: results[0].a,
            related: results.slice(1),
          }
        : {
            role: "bot",
            text:
              "Mohon maaf, saya belum menemukan jawaban yang sesuai di basis data fikih sehari-hari kami. Untuk pertanyaan spesifik, silakan hubungi langsung tim fatwa MUI Jakarta Timur.",
            escalate: true,
          };
    setMessages((prev) => [...prev, { role: "user", text: q }, botMsg]);
    setInput("");
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] md:text-[12.5px] text-lime font-bold mb-2 flex items-center gap-1.5 flex-wrap">
            <Link href="/layanan" className="hover:underline">Layanan Umat</Link>
            <span>&rsaquo;</span>
            <span>Tanya Ulama</span>
          </div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">Tanya Ulama</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">
            Jawaban cepat untuk pertanyaan fikih sehari-hari. Untuk kasus khusus atau permohonan fatwa resmi,
            konsultasikan langsung dengan tim fatwa kami.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="bg-white rounded-2xl border border-line overflow-hidden flex flex-col h-[520px] shadow-[0_8px_24px_-8px_rgba(11,77,51,0.12)]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-5 py-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-green-dk2 text-white rounded-br-sm"
                      : "bg-cream text-ink rounded-bl-sm"
                  }`}
                >
                  {m.text}
                  {m.escalate && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-green-dk2 text-white text-[12px] font-bold px-3.5 py-2 hover:bg-green-dk transition-colors"
                      >
                        Hubungi Tim Fatwa via WhatsApp
                      </a>
                    </div>
                  )}
                  {m.related && m.related.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-ink/10">
                      <div className="text-[11px] font-bold text-ink-soft mb-1.5">Pertanyaan terkait:</div>
                      <div className="flex flex-col gap-1.5">
                        {m.related.map((r) => (
                          <button
                            key={r.q}
                            onClick={() => ask(r.q)}
                            className="text-left text-[12.5px] font-semibold text-green-dk hover:underline"
                          >
                            {r.q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 md:px-5 pb-3 flex flex-wrap gap-2">
              {faqList.slice(0, 4).map((f) => (
                <button
                  key={f.q}
                  onClick={() => ask(f.q)}
                  className="rounded-full border border-line text-[11.5px] font-semibold text-ink-soft px-3 py-1.5 hover:border-green-dk hover:text-green-dk transition-colors"
                >
                  {f.q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="border-t border-line p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan Anda…"
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-[13.5px] outline-none focus:border-green-dk transition-colors"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-green-dk2 text-white font-bold text-[12.5px] px-5 py-2.5 hover:bg-green-dk transition-colors"
            >
              Kirim
            </button>
          </form>
        </div>

        <p className="text-[11.5px] text-ink-soft text-center mt-6 leading-relaxed">
          Jawaban bersifat umum berdasarkan basis pengetahuan fikih sehari-hari, bukan fatwa resmi. Untuk permohonan
          fatwa tertulis, hubungi Sekretariat MUI Jakarta Timur.
        </p>
      </div>
    </div>
  );
}
