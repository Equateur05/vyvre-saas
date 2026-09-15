/**
 * VYVRE Service Worker v10.0.0
 * Basic offline-capable caching for the PWA experience.
 *
 * Strategy:
 *   - HTML : network-first, fallback cache (so updates ship immediately when online)
 *   - JS/CSS/manifest : stale-while-revalidate (instant render, refresh in bg)
 *   - Models (TF.js .bin / model.json) : cache-first (immutable, 1 day)
 *   - Everything else : passthrough (no cache pollution)
 */

const CACHE_VERSION = 'vyvre-v10-0-0';
const CACHE_STATIC = CACHE_VERSION + '-static';
const CACHE_MODELS = CACHE_VERSION + '-models';
const CACHE_PAGES = CACHE_VERSION + '-pages';

const CORE_ASSETS = [
  '/scan/manifest.webmanifest',
  '/scan/vyvre-loader.js',
  '/scan/vyvre-tracker.js',
  '/scan/vyvre-mobile.css',
  '/scan/vyvre-scan-engine.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      // Pre-cache best-effort — don't fail install if one asset 404s
      return Promise.all(CORE_ASSETS.map(url =>
        cache.add(url).catch(err => console.warn('[vyvre-sw] precache miss:', url, err.message))
      ));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('vyvre-') && !k.startsWith(CACHE_VERSION))
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

function isModelAsset(url) {
  return /\/models\/.+\.(bin|json)$/i.test(url) || /age-cnn/i.test(url);
}

function isStaticAsset(url) {
  return /\.(js|css|webmanifest|svg|woff2?|png|jpe?g)$/i.test(url);
}

function isHTMLRequest(req) {
  if (req.mode === 'navigate') return true;
  const accept = req.headers.get('accept') || '';
  return accept.includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Skip non-GET
  if (req.method !== 'GET') return;
  // Skip cross-origin (TF.js CDN, fonts) — let browser handle them with its own caching
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML : network-first
  if (isHTMLRequest(req)) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_PAGES).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then(r => r || new Response('Offline', { status: 503 })))
    );
    return;
  }

  // Models : cache-first
  if (isModelAsset(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_MODELS).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  // Static assets : stale-while-revalidate
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_STATIC).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
