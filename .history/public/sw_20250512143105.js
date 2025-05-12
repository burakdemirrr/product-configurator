const CACHE_NAME = '3d-product-configurator-cache-v1';
const ASSETS_TO_CACHE = [
  '/models/car_glb.glb',
  '/hdri/bloem_train_track_cloudy_4k.exr'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching 3D assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Only cache 3D model and HDRI requests
  const url = new URL(event.request.url);
  const isModelOrHDRI = url.pathname.endsWith('.glb') || 
                        url.pathname.endsWith('.gltf') ||
                        url.pathname.endsWith('.hdr') ||
                        url.pathname.endsWith('.exr');
                        
  if (isModelOrHDRI) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return from cache if found
          if (response) {
            return response;
          }
          
          // Otherwise fetch from network and cache for next time
          return fetch(event.request).then((networkResponse) => {
            // Clone the response before using it
            const responseToCache = networkResponse.clone();
            
            // Cache for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return networkResponse;
          });
        })
        .catch(() => {
          // Fallback for offline or if fetch fails
          return new Response(
            JSON.stringify({ error: 'Network request failed' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
  } else {
    // Use normal fetch behavior for other requests
    event.respondWith(fetch(event.request));
  }
}); 