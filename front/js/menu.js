// Menú hamburguesa de la navbar pública (index.html).
// Se abre/cierra con el botón ☰ y se cierra solo al tocar una opción,
// al tocar afuera o con la tecla Esc.
//
// - Todo va dentro de una función para no chocar con variables de otros scripts.
// - Espera a que la página termine de cargar, así funciona aunque el <script>
//   esté en el <head>.
// - Busca los elementos por id y, si no los encuentra, por clase.

(function () {

    function iniciarMenu() {

        // Si ya se inició (script cargado dos veces), no repetir
        if (window.__menuHamburguesaListo) return;

        const barra = document.getElementById("navbarPublica") || document.querySelector("header.navbar");
        const boton = document.getElementById("menuToggle")    || document.querySelector(".menu-toggle");
        const panel = document.getElementById("menuPrincipal") || document.querySelector(".menu-panel");

        if (!barra || !boton || !panel) {
            console.error(
                "Menú hamburguesa: no se encontró →",
                { header: !!barra, boton: !!boton, panel: !!panel },
                "Revisá que el HTML del navbar sea el nuevo."
            );
            return;
        }

        window.__menuHamburguesaListo = true;

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
            e.preventDefault();
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
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarMenu);
    } else {
        iniciarMenu();
    }

})();