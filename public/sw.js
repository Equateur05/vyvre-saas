/* VYVRE — service worker no-op (évite le 404 du loader PWA, pas de cache en dev). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
