const CACHE_NAME = "david-martinez-v14"; // 👈 subí la versión para forzar refresco de caché
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
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (event.request.method !== "GET" || !url.startsWith(self.location.origin)) return;
  if (url.includes("/turnos") || url.includes("/cliente") ||
      url.includes("/servicios") || url.includes("/empleados")) return;

  // Navegación (cargar una página): red primero, caché solo como respaldo offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match("/index.html")))
    );
    return;
  }

  // Assets (css/js/img): caché primero, como ya tenías
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});

// self.addEventListener("fetch", (event) => {

//   const url = event.request.url;

//   // Solo cachear peticiones GET del propio origen — nunca extensiones, nunca otros esquemas
//   if (event.request.method !== "GET" || !url.startsWith(self.location.origin)) {
//     return;
//   }

//   if (url.includes("/turnos") ||
//       url.includes("/cliente") ||
//       url.includes("/servicios") ||
//       url.includes("/empleados")) {
//     return;
//   }

//     event.respondWith(
//     caches.match(event.request).then((cached) => {
//       if (cached) return cached;

//       return fetch(event.request)
//         .then((response) => {
//           if (!response || response.status !== 200 || response.type !== "basic") {
//             return response;
//           }

//           const responseClone = response.clone();

//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseClone);
//           });

//           return response;
//         })
//         .catch(() => {
//           // Solo mostramos un fallback si es una NAVEGACIÓN (el usuario
//           // está entrando a una página), nunca para JS/CSS/imágenes.
//           if (event.request.mode === "navigate") {
//             return caches.match("./index.html");
//           }
//           // Para assets, dejamos que el error se propague normalmente
//           return Response.error();
//         });
//     })
//   );
// });

