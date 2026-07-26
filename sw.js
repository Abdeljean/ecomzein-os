// Ecom Zein OS — Service Worker v4
// Strategy: Cache-first for app shell, Network-first for API

const CACHE_VERSION = 'ecomzein-v4';
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/logo.png',
  '/logo-mark.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.png',
  '/favicon.ico',
  '/sw.js'
];

// ─── INSTALL: pre-cache app shell ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[EcomZein SW v3] Installing...');
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[EcomZein SW] Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[EcomZein SW v3] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => {
          console.log('[EcomZein SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── FETCH: Stale-while-revalidate strategy ────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip browser extensions
  if (!request.url.startsWith('http')) return;

  // Skip backend API calls — always network
  if (request.url.includes('/api/')) return;

  // For HTML navigation — serve from cache, update in background
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(cached => {
        const networkFetch = fetch(request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_VERSION).then(c => c.put(request, response.clone()));
          }
          return response;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  // For static assets — cache first, fallback network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Stale-while-revalidate: return cache instantly, update in bg
        fetch(request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            caches.open(CACHE_VERSION).then(c => c.put(request, response));
          }
        }).catch(() => {});
        return cached;
      }
      // Not in cache — fetch from network
      return fetch(request).then(response => {
        if (!response || response.status !== 200) return response;
        const cloned = response.clone();
        caches.open(CACHE_VERSION).then(c => c.put(request, cloned));
        return response;
      }).catch(() => {
        // Offline fallback for HTML
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ─── PUSH NOTIFICATIONS (future ready) ────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Ecom Zein OS', {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'ecomzein-notif',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
