const CACHE_NAME = 'tl-pwa-cache-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // For API or non-http requests, ignore
  if (!url.protocol.startsWith('http')) return;

  // Let browser natively handle range requests for large PDF textbooks, workers, and cmaps
  if (
    url.pathname.includes('/textbooks/') || 
    url.pathname.endsWith('.pdf') || 
    url.pathname.includes('pdf.worker') || 
    url.pathname.includes('/cmaps/')
  ) {
    return;
  }

  // Stale-While-Revalidate strategy for static assets
  event.respondWith(
    caches.match(req).then((cachedResp) => {
      const fetchPromise = fetch(req).then((networkResp) => {
        if (networkResp && networkResp.status === 200) {
          const respToCache = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, respToCache);
          });
        }
        return networkResp;
      }).catch(() => {
        // Offline fallback
        return cachedResp;
      });

      // If cached response exists, return it immediately for instant 0.05s load!
      return cachedResp || fetchPromise;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
