"use client";

import Icon from "./Icon";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const FALLBACK_WA = { number: "6281233881973", message: "Assalamu'alaikum, saya ingin bertanya tentang..." };
const WELCOME = {
  role: "bot",
  text: "Assalamu'alaikum! Tanya apa saja seputar konten yang tersedia. Kalau saya tidak menemukan jawabannya, Anda bisa lanjut hubungi sekretariat.",
};

function WhatsAppIcon({size=18}) {return <Icon name="logo-whatsapp" size={size}/>;}

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
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-dk2 text-white text-[11.5px] font-bold px-3 py-1.5"
                >
                  <WhatsAppIcon size={12} /> Hubungi Sekretariat
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
          aria-label="Pertanyaan bantuan situs" placeholder="Tulis pertanyaan…"
          className="min-w-0 flex-1 rounded-full border border-line px-3.5 py-2 text-[12.5px] outline-none focus:border-green-dk transition-colors"
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
  const launcherRef = useRef(null);
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  useEffect(()=>{if(pathname!=="/")return;const check=()=>{const hero=[...document.querySelectorAll(".home-hero,.mobile-home-hero")].find(el=>el.getClientRects().length);setPastHero(!hero || !hero.getClientRects().length || hero.getBoundingClientRect().bottom <= 80);};check();window.addEventListener("scroll",check,{passive:true});window.addEventListener("resize",check);return()=>{window.removeEventListener("scroll",check);window.removeEventListener("resize",check);};},[pathname]);

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

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { if(!open)return; panelRef.current?.querySelector('button')?.focus(); const onKey=e=>{if(e.key==='Escape'){setOpen(false);launcherRef.current?.focus();}}; document.addEventListener('keydown',onKey); return()=>document.removeEventListener('keydown',onKey); }, [open]);
  if((pathname === '/' && !pastHero) || pathname?.startsWith('/layanan/tanya-ulama') || pathname?.startsWith('/layanan/jadwal-shalat')) return null;
  const waHref = `https://wa.me/${wa.number}?text=${encodeURIComponent(wa.message)}`;

  return (
    <div className="help-dock flex flex-col items-end gap-3" ref={panelRef}>
      {open && (
        <div role="dialog" aria-label="Bantuan situs" className="help-panel w-80 bg-white border border-line rounded-xl shadow-card overflow-hidden">
          <div className="bg-green-dk2/90 backdrop-blur-xl px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {tab === "ai" && (
                <button
                  onClick={() => setTab("menu")}
                  aria-label="Kembali"
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10"
                >
                  <Icon name="chevron-back-outline" size={20}/>
                </button>
              )}
              <div>
                <div className="text-white font-extrabold text-[13.5px]">
                  {tab === "ai" ? "Tanya AI" : "Bantuan situs"}
                </div>
                <div className="text-white/60 text-[11px]">MUI Jakarta Timur</div>
              </div>
            </div>
            <button
              onClick={() => {setOpen(false); launcherRef.current?.focus();}}
              aria-label="Tutup"
              className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon name="close-outline" size={20}/>
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
                  <Icon name="chatbubbles-outline" size={20}/>
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
                  <div className="text-[13px] font-bold text-ink">Hubungi Sekretariat</div>
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
        ref={launcherRef}
        aria-label={open ? "Tutup bantuan situs" : "Buka bantuan situs"}
        aria-expanded={open}
        className="help-launcher rounded-full bg-green-dk2 text-white flex items-center justify-center gap-2"
      >
        
        <Icon name="help-circle-outline" size={20}/><span>Bantuan</span>
      </button>
    </div>
  );
}


