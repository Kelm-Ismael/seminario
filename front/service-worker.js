const CACHE_NAME = "david-martinez-v1";

const ASSETS_TO_CACHE = [
  "/index.html",
  "/css/style.css",
  "/js/carrusel.js",
  "/assets/logo/logo.png",
  "/pages/turnos.html",
  "/pages/servicios.html",
  "/pages/clientes.html",
  "/css/turno.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // No cachear llamadas a la API — siempre red
  if (event.request.url.includes("/turnos") ||
      event.request.url.includes("/cliente") ||
      event.request.url.includes("/servicios") ||
      event.request.url.includes("/empleados")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});