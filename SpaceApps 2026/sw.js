const CACHE_NAME = 'astrovital-shell-v25';
const APP_SHELL = [
  './', './index.html', './AstroVital_Mission_Health.html', './styles.css', './i18n-catalog.js', './i18n.js', './app.js', './nasa-power.js', './feature-data.js', './health-baseline.js', './manifest.webmanifest',
  './icons/astrovital.svg', './icons/astrovital-192.png', './icons/astrovital-512.png',
  './icons/rufus-wave.png', './icons/rufus-confident.png', './icons/rufus-rest.png', './icons/rufus-sleep.png',
  './icons/rufus-layer-satellite.svg', './icons/rufus-layer-wrist.svg', './icons/rufus-layer-slate.svg', './icons/rufus-layer-pack.svg'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => (key.startsWith('astrovital-shell-') || key.startsWith('rufus-shell-')) && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE_NAME).then((cache) => cache.match(event.request)).then((cached) => {
    if (cached) return cached;
    return fetch(event.request).then((response) => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); }
      return response;
    }).catch(() => event.request.mode === 'navigate' ? caches.open(CACHE_NAME).then((cache) => cache.match('./index.html')) : Response.error());
  }));
});