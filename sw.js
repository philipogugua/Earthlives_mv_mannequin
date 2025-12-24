// Service Worker for EarthLives Landing Page
// Caches assets for offline support

const CACHE_NAME = 'earthlives-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/model-viewer.min.js',
  '/script.min.js',
  '/assets/images/logo.png',
  '/assets/images/banner1.png',
  '/assets/images/banner2.png',
  '/assets/images/banner3.png',
  '/assets/images/banner4.png',
  '/assets/images/banner6.png',
  '/assets/images/banner7.png',
  '/assets/images/banner8.png',
  '/assets/images/banner9.png',
  '/assets/images/banner10.png',
  '/assets/images/about.png',
  '/assets/images/imgs1.png',
  '/assets/images/imgs2.png',
  '/assets/images/imgs3.png',
  '/assets/images/imgs4.png',
  '/assets/font/fontawesome-free-7.1.0-web/css/all.css',
  '/assets/font/fontawesome-free-7.1.0-web/js/all.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
        console.warn('Some assets could not be cached:', error);
        // Continue even if some assets fail to cache
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and POST requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache successful responses
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page or cached page
          return caches.match('/index.html');
        });
    })
  );
});
