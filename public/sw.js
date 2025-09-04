// Service Worker for caching and offline support
const CACHE_NAME = 'guilds-v1';
const STATIC_CACHE = 'guilds-static-v1';
const DYNAMIC_CACHE = 'guilds-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/assets/guilds-logo-full.svg',
  '/assets/guilds-logo-shield.svg',
  '/assets/hero-image.jpg'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request);
        })
        .catch(() => {
          // Fallback to offline page if available
          return caches.match('/');
        })
    );
    return;
  }

  // Handle asset requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request).then((fetchResponse) => {
          // Don't cache non-success responses
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // Cache the response
          const responseToCache = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseToCache);
            });

          return fetchResponse;
        });
      })
  );
});