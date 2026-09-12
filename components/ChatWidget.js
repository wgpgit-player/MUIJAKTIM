"use client";

import { useEffect, useRef, useState } from "react";

const FALLBACK_WA = { number: "6281233881973", message: "Assalamu'alaikum, saya ingin bertanya tentang..." };
const WELCOME = {
  role: "bot",
  text: "Assalamu'alaikum! Tanya apa saja seputar konten yang tersedia. Kalau saya tidak menemukan jawabannya, Anda bisa lanjut chat admin.",
};

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5C10 9 9.5 7.7 9.3 7.2c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4Z" />
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
    </svg>
  );
}

function AiTab({ waHref }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function ask(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer, source: data.source, escalate: !data.found },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Terjadi gangguan. Silahkan chat dengan admin.", escalate: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[360px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user" ? "bg-green-dk2 text-white rounded-br-sm" : "bg-cream text-ink rounded-bl-sm"
              }`}
            >
              {m.text}
              {m.source && <div className="text-[10.5px] text-ink-soft mt-1.5">Sumber: {m.source}</div>}
              {m.escalate && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-white text-[11.5px] font-bold px-3 py-1.5"
                >
                  <WhatsAppIcon size={12} /> Chat Admin
                </a>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-[11.5px] text-ink-soft px-1">Mencari jawaban…</div>}
      </div>
      <form onSubmit={ask} className="border-t border-line p-2.5 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan…"
          className="flex-1 rounded-full border border-line px-3.5 py-2 text-[12.5px] outline-none focus:border-green-dk transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full bg-green-dk2 text-white font-bold text-[11.5px] px-4 py-2 hover:bg-green-dk transition-colors disabled:opacity-60"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("menu"); // menu | ai
  const [wa, setWa] = useState(FALLBACK_WA);
  const panelRef = useRef(null);

  useEffect(() => {
    fetch("/api/settings/whatsapp-contact", { signal: AbortSignal.timeout(5000) })
      .then((res) => res.json())
      .then((data) => data.ok && setWa({ number: data.number, message: data.message }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const waHref = `https://wa.me/${wa.number}?text=${encodeURIComponent(wa.message)}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-5 z-[70] flex flex-col items-end gap-3" ref={panelRef}>
      {open && (
        <div className="w-80 max-w-[88vw] bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_16px_48px_-12px_rgba(11,77,51,0.35)] overflow-hidden">
          <div className="bg-green-dk2/90 backdrop-blur-xl px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tab === "ai" && (
                <button
                  onClick={() => setTab("menu")}
                  aria-label="Kembali"
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="m15 6-6 6 6 6" />
                  </svg>
                </button>
              )}
              <div>
                <div className="text-white font-extrabold text-[13.5px]">
                  {tab === "ai" ? "Tanya AI" : "Chat with Us"}
                </div>
                <div className="text-white/60 text-[11px]">MUI Jakarta Timur</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {tab === "ai" ? (
            <AiTab waHref={waHref} />
          ) : (
            <div className="p-3.5 flex flex-col gap-2.5">
              <button
                onClick={() => setTab("ai")}
                className="w-full flex items-center gap-3 rounded-2xl border border-line px-3.5 py-3 text-left hover:border-emerald hover:bg-emerald/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-emerald/15 text-green-dk2 flex items-center justify-center shrink-0">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2a7 7 0 0 0-7 7c0 3 1.5 4.7 2 6-.2.9-.7 2-1.5 3 1.3.2 2.5-.1 3.5-.7A7 7 0 1 0 12 2Z" />
                    <circle cx="9.5" cy="10" r="0.8" fill="currentColor" />
                    <circle cx="14.5" cy="10" r="0.8" fill="currentColor" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-ink">Tanya AI</div>
                  <div className="text-[11px] text-ink-soft">Jawaban otomatis dari dokumen kami</div>
                </div>
              </button>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 rounded-2xl border border-line px-3.5 py-3 text-left hover:border-emerald hover:bg-emerald/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#25D366]/15 text-[#1FAF56] flex items-center justify-center shrink-0">
                  <WhatsAppIcon />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-ink">Chat Admin</div>
                  <div className="text-[11px] text-ink-soft">Dialihkan ke WhatsApp</div>
                </div>
              </a>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          setOpen((v) => !v);
          setTab("menu");
        }}
        aria-label="Buka Chat with Us"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)] flex items-center justify-center hover:scale-105 transition-transform relative"
      >
        {!open && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-lime border-2 border-white" />}
        <WhatsAppIcon size={28} />
      </button>
    </div>
  );
}
