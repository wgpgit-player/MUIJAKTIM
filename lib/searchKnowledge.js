const STOPWORDS = new Set([
  "yang", "dan", "di", "ke", "dari", "untuk", "pada", "adalah", "dengan", "ini", "itu",
  "atau", "juga", "akan", "dalam", "tidak", "ada", "apa", "bagaimana", "kapan", "siapa",
  "saya", "kamu", "anda", "kita", "dia", "mereka", "ya", "sih", "dong", "lah", "nya",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Scores every chunk against the question by token overlap (simple TF-style match,
 * no embeddings/AI — see the "gratis selamanya" decision in docs). Returns chunks
 * sorted best-first; caller decides the "not found" cutoff.
 */
export function searchKnowledge(question, chunks) {
  const qTokens = tokenize(question);
  if (qTokens.length === 0) return [];

  const scored = chunks.map((chunk) => {
    const cTokens = tokenize(chunk.content);
    const cTokenSet = new Set(cTokens);
    let score = 0;
    for (const t of qTokens) {
      if (cTokenSet.has(t)) score += 1;
      else if (cTokens.some((ct) => ct.includes(t) || t.includes(ct))) score += 0.4;
    }
    // Normalize a bit so very long chunks don't win purely on size.
    const normalized = score / Math.sqrt(cTokens.length || 1);
    return { chunk, score: normalized, rawScore: score };
  });

  return scored
    .filter((s) => s.rawScore > 0)
    .sort((a, b) => b.score - a.score);
}
