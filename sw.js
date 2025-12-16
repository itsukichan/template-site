const CACHE_NAME = "template-site-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/lower-page/index.html",
  "/assets/css/common.css",
  "/css/style.css",
  "/lower-page/css/style.css",
  "/assets/js/common.js",
  "/js/index.js",
  "/lower-page/js/index.js",
];

// インストール時にキャッシュを作成
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// フェッチイベントでキャッシュから取得、なければネットワークから取得
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュがあればそれを返す、なければネットワークから取得
      return (
        response ||
        fetch(event.request).then((response) => {
          // レスポンスをクローンしてキャッシュに保存
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
      );
    })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

