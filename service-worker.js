const CACHE_NAME = 'Love Ruby';
const urlsToCache = [
    '/index.html',
    '/css/*',
    '/fonts/*',
    '/images/*',
    '/js/*'
];

self.addEventListener('install', event => {
    // Perform installation: caching app shell and assets
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    // Clean up old caches if any exist
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(cacheName => {
                        return cacheName !== CACHE_NAME;
                    }).map(cacheName => {
                        return caches.delete(cacheName);
                    })
                );
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Try to fetch the request from the network if it's not in the cache
                return response || fetch(event.request);
            })
            .catch(error => {
                console.error('Error in fetch handler:', error);
            })
    );
});