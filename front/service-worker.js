const CACHE_NAME = "david-martinez-v17";

const ASSETS_TO_CACHE = [
  "/",
  "./index.html",
  "/css/style.css",
  "/js/carrusel.js",
  "/assets/logo/logo.png",
  "/pages/turnos.html",
  "/pages/servicios.html",
  "/pages/clientes.html",
  "/css/turno.css"
];

// ==========================================================
// INSTALL — precachea los assets base y activa la versión
// nueva de inmediato (sin esperar a que cierres todas las pestañas)
// ==========================================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// ==========================================================
// ACTIVATE — borra cachés de versiones anteriores y toma
// control de las pestañas ya abiertas sin esperar a un reload
// ==========================================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

// ==========================================================
// FETCH
// ==========================================================
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (event.request.method !== "GET" || !url.startsWith(self.location.origin)) return;

  // Nunca cachear llamadas a la API (turnos, cliente, servicios, empleados)
  if (
    url.includes("/turnos") ||
    url.includes("/cliente") ||
    url.includes("/servicios") ||
    url.includes("/empleados")
  ) {
    return;
  }

  // Navegación (cargar una página): red primero, caché solo como respaldo offline.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() =>
          caches.open(CACHE_NAME).then((cache) =>
            cache.match(event.request).then((c) => c || cache.match("/index.html"))
          )
        )
    );
    return;
  }

  // Assets (css/js/img): RED PRIMERO. Así cualquier cambio en un archivo se ve
  // apenas se sube, sin depender de acordarse de subir CACHE_NAME a mano.
  // La caché queda solo como respaldo para cuando no hay conexión.
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.open(CACHE_NAME).then((cache) => cache.match(event.request))
      )
  );
});