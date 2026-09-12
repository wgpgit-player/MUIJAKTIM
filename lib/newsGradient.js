const GRADIENTS = [
  "from-green-dk2 to-green",
  "from-emerald to-green",
  "from-green-dk to-green",
  "from-green-dk2 to-emerald",
  "from-green to-green-dk",
];

/** Deterministic cosmetic gradient for a news card, derived from its slug. */
export function gradientFor(slug) {
  const hash = [...slug].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
}
