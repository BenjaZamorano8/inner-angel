// Cambia la versión cada vez que actualices la app para refrescar la caché
const CACHE = "inner-angel-v3";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-angel-192.png", "icon-angel-512.png", "icon-angel-maskable-512.png", "logo-header.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Red primero (así siempre ves la última versión con internet); caché si estás offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
