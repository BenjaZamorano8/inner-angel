// Cambia la versión cada vez que actualices la app para refrescar la caché
const CACHE = "inner-angel-v2";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "logo-header.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
