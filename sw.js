/* Service Worker — cache "app shell" để chạy offline, cache-first cho shell.
   Mỗi lần sửa & đẩy lên: TĂNG VERSION (bước 0,1) để kích hoạt cập nhật. */
importScripts("./version.js");
const VERSION = self.APP_VERSION;
const CACHE = "cs-hub-v" + VERSION;

/* Đường dẫn tương đối theo vị trí sw.js → chạy được ở mọi repo/đường dẫn & tên miền */
const SHELL = [
  "./",
  "./index.html",
  "./apps.js",
  "./version.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Cho phép trang yêu cầu kích hoạt bản mới ngay (nút "Tải lại") */
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* Chỉ xử lý tài nguyên cùng nguồn (shell). Link app con sang nguồn khác → để mạng lo. */
  if (url.origin !== self.location.origin) return;

  /* Trang HTML: network-first (luôn lấy bản mới nếu có mạng), fallback cache khi offline */
  const isDoc = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isDoc) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  /* Tài nguyên tĩnh (JS/icon/manifest): cache-first, nền cập nhật lại cache */
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
