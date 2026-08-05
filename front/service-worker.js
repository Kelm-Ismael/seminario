const CACHE_NAME = "david-martinez-v15"; // 👈 subí la versión para forzar refresco de caché

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
  // Usamos la caché de ESTA versión puntualmente, no todas.
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

  // Assets (css/js/img): caché primero, buscando SOLO en la versión actual
  // (no en caches.match global, que podría devolver algo de una versión vieja)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const clone = response.clone();
          cache.put(event.request, clone);
          return response;
        });
      })
    )
  );
});