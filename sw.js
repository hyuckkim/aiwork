const CACHE_NAME = "editor-cache-v1";
const OFFLINE_FALLBACK = "/aiwork/editor.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const assets = [
        "/aiwork/manifest.json",
        "/aiwork/icon-192.png",
        "/aiwork/icon-512.png",
        "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js",
        "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js",
        "/aiwork/editor.html"
      ];
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_FALLBACK)
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  }
});
