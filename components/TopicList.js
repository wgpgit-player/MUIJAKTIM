export default function TopicList({ items }) {
  return (
    <div className="divide-y divide-line border-t border-b border-line">
      {items.map((item, i) => (
        <div key={item.code} className="py-6 flex gap-5 md:gap-8">
          <div className="text-[13px] font-bold text-line shrink-0 w-6 pt-0.5" style={{ color: "#C9D6CE" }}>
            {item.code}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-[15px] md:text-[16px] text-green-dk2 mb-1.5">{item.title}</div>
            <p className="text-[13.5px] text-ink-soft leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
