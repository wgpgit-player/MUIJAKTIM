/// In-memory "stale-if-error" cache for external API routes. Survives within a single
/// server instance's lifetime (resets on redeploy/cold start) — good enough to avoid
/// showing an empty state just because one upstream fetch blipped.
const store = new Map<string, unknown>();

export function getLastGood<T>(key: string): T | undefined {
  return store.get(key) as T | undefined;
}

export function setLastGood<T>(key: string, value: T): void {
  store.set(key, value);
}
