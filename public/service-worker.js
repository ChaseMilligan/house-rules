let CACHE_NAME = 'houseRules1';
let urlsToCache = [
    'index.html'
];

const self = this;

self.addEventListener('install', function (event)
{
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache)
            {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event)
{
    event.respondWith(
        caches.match(event.request)
            .then(function ()
            {
                return fetch(event.request).catch(() =>
                {
                    caches.match('index.html');
                })
            })
    );
});

self.addEventListener('activate', function (event)
{
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) =>
            {
                if (!cacheWhitelist.includes(cacheName))
                {
                    return caches.delete(cacheName)
                }
            })
        ))
    );
});