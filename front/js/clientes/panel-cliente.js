// js/panel-cliente.js
// Mantiene el sidebar y el topbar fijos: al navegar entre secciones,
// hace fetch de la página destino y reemplaza solo el contenido
// dentro de .panel-content, sin recargar el resto del layout.

document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".sidebar-menu a");
    const contenedor = document.querySelector(".panel-content");

    if (!contenedor) return;

    async function cargarSeccion(url, actualizarHistorial = true) {

        try {

            const respuesta = await fetch(url);

            if (!respuesta.ok) {
                throw new Error("No se pudo cargar la sección");
            }

            const html = await respuesta.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const nuevoContenido = doc.querySelector(".panel-content");
            const nuevoTitulo = doc.title;

            if (nuevoContenido) {
                contenedor.innerHTML = nuevoContenido.innerHTML;
            }

            if (nuevoTitulo) {
                document.title = nuevoTitulo;
            }

            if (actualizarHistorial) {
                history.pushState({ url }, "", url);
            }

            marcarLinkActivo(url);

        } catch (error) {

            console.error(error);
            // Si algo falla, navegamos normal como respaldo
            window.location.href = url;

        }

    }

    function marcarLinkActivo(url) {

        links.forEach(link => {

            const linkUrl = new URL(link.href).pathname;
            const destinoUrl = new URL(url, window.location.href).pathname;

            link.classList.toggle("active", linkUrl === destinoUrl);

        });

    }

    // Interceptar clicks del menú lateral
    links.forEach(link => {

        link.addEventListener("click", (e) => {

            const url = link.getAttribute("href");

            if (!url || url === "#" || link.target === "_blank") return;

            e.preventDefault();

            const actual = window.location.pathname.split("/").pop();

            if (url === actual) return;

            cargarSeccion(url);

        });

    });

    // Soporte para los botones atrás / adelante del navegador
    window.addEventListener("popstate", () => {
        cargarSeccion(window.location.pathname, false);
    });

});