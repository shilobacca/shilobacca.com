var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/index.html',
    '/js/main.js',
    '/css/main.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {

  var cacheAllowlist = ['pages-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
/* 
Works when I place in /


*/

/*  This is the first working 
let cacheName = "my-first-pwa";
let filesToCache = [
    "/",
    "/js/main.js",
    "/css/main.css"
];

/* Start the service worker and cache all of the app's content 
self.addEventListener("install", (e) => {
  // Perform install steps  
  e.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline 
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request)
      .then((response) => {
      // Cache hit - return response
      return response || fetch(e.request);
    })
  );
});
*/