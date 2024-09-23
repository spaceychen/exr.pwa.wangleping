const CACHE_NAME = "my-cache";

self.addEventListener("install", (event) => {
  self.skipWaiting(); // 跳过等待
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./",
        "./manifest.json",
        "./index.html",
        "./404.html",
        "./error.html",
        "/assets/ico.png",
        "/assets/man1.jpg",
        "/assets/girl1.jpg",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  return event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (event.request.mode === "navigate" && res.status == 404) {
          // 404页面
          return caches.match("404.html");
        }
        return res;
      })
      .catch(() => {
        // 离线处理
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(event.request).then((response) => {
            if (response) return response;

            return caches.match("./404.html");
          });
        });
      })
  );
});
