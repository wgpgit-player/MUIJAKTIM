export default function QuoteCard() {
  return (
    <div className="h-full bg-gradient-to-br from-green-dk to-green-dk2 rounded-2xl p-5 md:p-6 relative overflow-hidden flex flex-col justify-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-60">
        <path d="M7 8c-2 0-3.5 1.6-3.5 3.6C3.5 13.5 5 15 7 15c.3 0 .6 0 .8-.1C7 17 5 18.5 3 19" stroke="#C8F049" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16 8c-2 0-3.5 1.6-3.5 3.6 0 1.9 1.5 3.4 3.5 3.4.3 0 .6 0 .8-.1-.8 2.1-2.8 3.6-4.8 4.1" stroke="#C8F049" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <p className="text-white text-[15px] md:text-[17px] leading-relaxed font-semibold mb-4">
        &ldquo;Barangsiapa yang menempuh suatu jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan
        menuju surga.&rdquo;
      </p>
      <div className="text-lime text-[12.5px] font-bold">— HR. Muslim</div>
    </div>
  );
}
