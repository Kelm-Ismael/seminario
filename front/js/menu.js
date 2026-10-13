// Menú hamburguesa de la navbar pública (index.html).
// Se abre/cierra con el botón ☰ y se cierra solo al tocar una opción,
// al tocar afuera o con la tecla Esc.

const navbar = document.getElementById("navbarPublica");
const boton  = document.getElementById("menuToggle");
const panel  = document.getElementById("menuPrincipal");

if (navbar && boton && panel) {

    const abrir = () => {
        navbar.classList.add("menu-abierto");
        boton.setAttribute("aria-expanded", "true");
        boton.setAttribute("aria-label", "Cerrar menú");
    };

    const cerrar = () => {
        navbar.classList.remove("menu-abierto");
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-label", "Abrir menú");
    };

    // Tocar el botón: abre o cierra
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        navbar.classList.contains("menu-abierto") ? cerrar() : abrir();
    });

    // Tocar una opción: se cierra solo
    panel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", cerrar);
    });

    // Tocar afuera: se cierra solo
    document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target)) cerrar();
    });

    // Tecla Esc: se cierra
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrar();
    });
}