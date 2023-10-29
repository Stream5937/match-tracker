//service worker.js for match tracker app

/*When updating a service worker, the VERSION constant doesn't need to be updated, as any change in the content of the service worker script itself will trigger the browser to install the new service worker. However, it is a good practice to update the version number as it makes it easier to see which version of the service worker is currently running in the browser, by checking the name of the Cache in the browser dev. Application tool (or Sources tool).
*/

const VERSION = "v1";

/*Note: Updating VERSION is important when making changes to any application resource, including the CSS, HTML, and JS code, and image assets. The version number, or any change to the service worker file, is the only way to force an update of the app for users
*/
const CACHE_NAME = `match-tracker-${VERSION}`;

const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/cycletrack.json",
  "/icons/wheel.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        }),
      );
      await clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  // when seeking an HTML page
  if (event.request.mode === "navigate") {
    // Return to the index.html page
    event.respondWith(caches.match("/"));
    return;
  }

  // For every other request type
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // Respond with a HTTP 404 response status.
      return new Response(null, { status: 404 });
    })(),
  );
});


