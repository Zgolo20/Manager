// Nkhuku PWA Service Worker v4.0
// ─────────────────────────────────────────────────
// Strategy:
//   • index.html        → Network-first (always gets latest deploy)
//   • JS / CSS / fonts  → Cache-first with network fallback (offline support)
//   • Firebase / EmailJS → Network-only (always live)
// ─────────────────────────────────────────────────
// 🔑 BUMP THIS VERSION NUMBER ON EVERY DEPLOY
// This forces the service worker to update immediately.
const VERSION    = 'nkhuku-v' + Date.now();
const CACHE_NAME = VERSION;

const PRECACHE_ASSETS = [
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
];

// External hosts that should always go to network
const NETWORK_ONLY_HOSTS = [
  'firebasejs',
  'firebase',
  'googleapis.com',
  'gstatic.com',
  'emailjs.com',
  'jsdelivr.net',
];

// ── Install ───────────────────────────────────────
// Pre-cache static assets only (NOT index.html)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────
// Delete ALL old caches so stale content is gone
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => {
      console.log('[SW] Activated:', CACHE_NAME);
      return self.clients.claim();
    }).then(() => {
      // Tell all open tabs to reload so they get the new version
      return self.clients.matchAll({ type: 'window' });
    }).then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
    })
  );
});

// ── Fetch ─────────────────────────────────────────
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 1. Network-only for external services (Firebase, EmailJS, fonts CDN)
  const isExternal = NETWORK_ONLY_HOSTS.some(host => url.href.includes(host));
  if (isExternal || url.origin !== location.origin) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // 2. Network-first for index.html — ALWAYS get the latest version
  if (url.pathname === '/' || url.pathname === '/index.html') {
    e.respondWith(
      fetch(e.request)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return networkRes;
        })
        .catch(() => {
          console.log('[SW] Offline — serving cached index.html');
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 3. Cache-first for everything else (icons, manifest)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(networkRes => {
        if (!networkRes || networkRes.status !== 200 || networkRes.type === 'opaque') {
          return networkRes;
        }
        const clone = networkRes.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return networkRes;
      });
    })
  );
});
