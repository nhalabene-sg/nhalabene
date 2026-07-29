/* Service worker minimal — Nhalabene Site Web (GitHub Pages / Netlify). */
self.addEventListener('install', function (e) {
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request));
});
