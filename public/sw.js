// Service Worker for caching and offline support - ENHANCED FOR SEO
const CACHE_NAME = 'guilds-v2';
const STATIC_CACHE = 'guilds-static-v2';
const DYNAMIC_CACHE = 'guilds-dynamic-v2';

// Files to cache immediately with long-term caching strategy
const STATIC_FILES = [
  '/',
  '/assets/hero-image.jpg',
  '/assets/guilds-logo-full.svg'
];

// Cache strategy for different asset types
const CACHE_STRATEGIES = {
  // Hashed assets - cache forever (immutable)
  HASHED_ASSETS: /\/assets\/.*-[a-zA-Z0-9]+\.(js|css|jpg|png|svg|woff2?)/,
  // Fonts - cache for 1 year
  FONTS: /\.(woff2?|eot|ttf|otf)$/,
  // Images - cache for 30 days
  IMAGES: /\.(jpg|jpeg|png|gif|svg|webp)$/,
  // API calls - cache for 1 hour
  API: /\/api\//,
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_FILES);
      }),
      self.skipWaiting()
    ])
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

// Fetch event - enhanced caching strategies for SEO
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET requests (POST, PUT, etc.)
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Handle different asset types with appropriate caching
  if (CACHE_STRATEGIES.HASHED_ASSETS.test(url.pathname)) {
    // Hashed assets - cache first (immutable)
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          const responseToCache = fetchResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return fetchResponse;
        });
      })
    );
    return;
  }

  if (CACHE_STRATEGIES.FONTS.test(url.pathname)) {
    // Fonts - cache first with long TTL
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          const responseToCache = fetchResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return fetchResponse;
        });
      })
    );
    return;
  }

  if (CACHE_STRATEGIES.IMAGES.test(url.pathname)) {
    // Images - cache first with medium TTL
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((fetchResponse) => {
          if (fetchResponse && fetchResponse.status === 200) {
            const responseToCache = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return fetchResponse;
        });
      })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        // Cache successful navigation responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Fallback to cached version or offline page
        return caches.match(request).then((response) => {
          return response || caches.match('/');
        });
      })
    );
    return;
  }

  // Default: network first with cache fallback
  event.respondWith(
    fetch(request).then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(request);
    })
  );
});