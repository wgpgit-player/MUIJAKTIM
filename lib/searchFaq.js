export function searchFaq(query, list) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const scored = list.map((item) => {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw.toLowerCase())) score += 3;
    }
    const qWords = q.split(/\s+/).filter((w) => w.length > 2);
    for (const w of qWords) {
      if (item.q.toLowerCase().includes(w)) score += 1;
      if (item.a.toLowerCase().includes(w)) score += 0.5;
    }
    return { item, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.item);
}
