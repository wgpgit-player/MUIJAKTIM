import Icon from "./Icon";
export default function QuoteCard() {
  return (
    <div className="hikmah-panel bg-green-dk rounded-2xl p-5 md:p-6 relative overflow-hidden flex flex-col justify-center">
      <Icon name="book-outline" size={28} className="mb-3 text-lime"/>
      <p className="text-white text-[15px] md:text-[17px] leading-relaxed font-semibold mb-4">
        &ldquo;Barangsiapa yang menempuh suatu jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan
        menuju surga.&rdquo;
      </p>
      <div className="text-lime text-[12.5px] font-bold">— HR. Muslim</div>
    </div>
  );
}
