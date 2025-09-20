const CACHE_NAME = "editor-cache-v1";
const OFFLINE_FALLBACK = "/editor.html";

// 개발 모드에서는 HTML 캐시 안 함
const DEV_MODE = location.hostname === "localhost";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const assets = [
        "/manifest.json",
        "/icon-192.png",
        "/icon-512.png",
        "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js",
        "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js",
      ];
      if (!DEV_MODE) {
        // 배포 모드일 때만 html도 캐시에 넣음
        assets.push("/index.html", "/editor.html");
      }
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // HTML은 네트워크 먼저 → 실패하면 fallback
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(DEV_MODE ? OFFLINE_FALLBACK : event.request)
      )
    );
  } else {
    // 나머지는 캐시 먼저
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  }
});