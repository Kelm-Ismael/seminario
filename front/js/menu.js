// Menú hamburguesa de la navbar pública (index.html).
// Se abre/cierra con el botón ☰ y se cierra solo al tocar una opción,
// al tocar afuera o con la tecla Esc.
//
// Todo va dentro de una función para que sus variables no choquen con
// las de otros scripts de la página (ej.: otra variable "navbar").

(function () {

    // Si el script se cargó dos veces, no hacer nada la segunda vez
    if (window.__menuHamburguesaListo) return;
    window.__menuHamburguesaListo = true;

    const barra = document.getElementById("navbarPublica");
    const boton = document.getElementById("menuToggle");
    const panel = document.getElementById("menuPrincipal");

    if (!barra || !boton || !panel) {
        console.error("Menú hamburguesa: falta navbarPublica, menuToggle o menuPrincipal en el HTML.");
        return;
    }

    const abrir = () => {
        barra.classList.add("menu-abierto");
        boton.setAttribute("aria-expanded", "true");
        boton.setAttribute("aria-label", "Cerrar menú");
    };

    const cerrar = () => {
        barra.classList.remove("menu-abierto");
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-label", "Abrir menú");
    };

    // Tocar el botón: abre o cierra
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        barra.classList.contains("menu-abierto") ? cerrar() : abrir();
    });

    // Tocar una opción: se cierra solo
    panel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", cerrar);
    });

    // Tocar afuera: se cierra solo
    document.addEventListener("click", (e) => {
        if (!barra.contains(e.target)) cerrar();
    });

    // Tecla Esc: se cierra
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrar();
    });

})();