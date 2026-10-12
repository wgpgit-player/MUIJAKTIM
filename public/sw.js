const CACHE_NAME = "muijaktim-public-v2";
const PRECACHE = ["/offline.html", "/manifest.json", "/logo.png", "/icons/icon-192.png", "/icons/icon-512.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME && (key.startsWith("muijaktim-cache-") || key.startsWith("muijaktim-public-"))).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if(request.method !== "GET" || url.origin !== self.location.origin) return;
  // Never retain API responses, authenticated pages, or Next.js RSC payloads.
  if(/^\/(api|admin|login|register|auth)(\/|$)/.test(url.pathname) || url.pathname.startsWith("/profil/akun") || request.headers.has("RSC") || url.searchParams.has("_rsc")) return;
  if(request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/offline.html")));
    return;
  }
  const asset = /\.(png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$/.test(url.pathname) || url.pathname === "/_next/image";
  if(!asset || url.pathname === "/sw.js") return;
  event.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const stored = await cache.match(request); if(stored) return stored;
    const response = await fetch(request);
    if(response.ok && response.type === "basic") {
      await cache.put(request, response.clone());
      const keys = await cache.keys();
      const extras = keys.filter(key => !PRECACHE.includes(new URL(key.url).pathname));
      if(extras.length > 60) await Promise.all(extras.slice(0, extras.length - 60).map(key => cache.delete(key)));
    }
    return response;
  }));
});
