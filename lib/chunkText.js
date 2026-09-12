const MAX_CHUNK_LEN = 900;
const MIN_CHUNK_LEN = 40;

/**
 * Splits raw text into paragraph-sized chunks for keyword search. Consecutive short
 * paragraphs are merged up to MAX_CHUNK_LEN so chunks carry enough context to be a
 * useful standalone answer; anything below MIN_CHUNK_LEN (e.g. stray headers) is
 * merged forward rather than kept as a fragment.
 */
export function chunkText(text) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const chunks = [];
  let buffer = "";

  for (const p of paragraphs) {
    if (!buffer) {
      buffer = p;
      continue;
    }
    if (buffer.length < MIN_CHUNK_LEN || buffer.length + p.length + 1 <= MAX_CHUNK_LEN) {
      buffer = `${buffer}\n${p}`;
    } else {
      chunks.push(buffer);
      buffer = p;
    }
  }
  if (buffer) chunks.push(buffer);

  return chunks.filter((c) => c.length > 0);
}
