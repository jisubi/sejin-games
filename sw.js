var CACHE_NAME = 'sejin-games-v2';
var urlsToCache = [
  '/games.html',
  '/racer.html',
  '/racer-keyboard.html',
  '/game.html',
  '/shape.html',
  '/train.html',
  '/kitchen.html',
  '/airplane.html',
  '/dinodig.html',
  '/sort.html',
  '/match.html',
  '/feed.html',
  '/trash.html',
  '/Shapes_Colors.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install - cache all game files and skip waiting
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Fetch - serve from cache, fall back to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(networkResponse) {
        // Cache new requests dynamically
        if (networkResponse && networkResponse.status === 200) {
          var responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    }).catch(function() {
      // Offline fallback - return the main page
      return caches.match('/games.html');
    })
  );
});

// Activate - clean up old caches and take control immediately
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});
