"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW registration failed:", err));
    } else {
      // Dev mode: a service worker registered from an earlier prod build (or before
      // this guard existed) will keep cache-first-serving stale, non-hashed webpack
      // chunks and break every rebuild with "options.factory" / module errors.
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      if (window.caches) {
        caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
      }
    }
  }, []);

  return null;
}
