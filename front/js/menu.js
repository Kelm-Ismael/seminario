// Navbar pública (index.html):
//  1) Menú hamburguesa: se abre/cierra con ☰ y se cierra solo al tocar una
//     opción, al tocar afuera o con la tecla Esc.
//  2) Estado del local ("Abierto ahora · cierra 21:00") según el horario.
//
// Todo va dentro de una función para no chocar con variables de otros
// scripts, y espera a que cargue la página (funciona aunque esté en el <head>).

(function () {

    // ======================================================
    // HORARIO DEL LOCAL — editar acá si cambia
    // 0 = domingo, 1 = lunes, ... 6 = sábado. null = cerrado.
    // ======================================================
    const HORARIOS = {
        0: null,
        1: { abre: "09:00", cierra: "21:00" },
        2: { abre: "09:00", cierra: "21:00" },
        3: { abre: "09:00", cierra: "21:00" },
        4: { abre: "09:00", cierra: "21:00" },
        5: { abre: "09:00", cierra: "21:00" },
        6: { abre: "09:00", cierra: "21:00" }
    };

    const ZONA_HORARIA = "America/Argentina/Buenos_Aires";
    const NOMBRES_DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

    // ------------------------------------------------------
    // Menú hamburguesa
    // ------------------------------------------------------
    function iniciarMenu() {
        if (window.__menuHamburguesaListo) return;

        const barra = document.getElementById("navbarPublica") || document.querySelector("header.navbar");
        const boton = document.getElementById("menuToggle")    || document.querySelector(".menu-toggle");
        const panel = document.getElementById("menuPrincipal") || document.querySelector(".menu-panel");

        if (!barra || !boton || !panel) {
            console.error("Menú hamburguesa: no se encontró →",
                { header: !!barra, boton: !!boton, panel: !!panel });
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

        boton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            barra.classList.contains("menu-abierto") ? cerrar() : abrir();
        });

        panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", cerrar));

        document.addEventListener("click", (e) => {
            if (!barra.contains(e.target)) cerrar();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") cerrar();
        });
    }

    // ------------------------------------------------------
    // Estado del local (abierto / cerrado)
    // ------------------------------------------------------
    const aMinutos = (hhmm) => {
        const [h, m] = hhmm.split(":").map(Number);
        return h * 60 + m;
    };

    // Día y hora actuales en Argentina, aunque el visitante esté en otro país
    function ahoraEnArgentina() {
        const partes = new Intl.DateTimeFormat("en-US", {
            timeZone: ZONA_HORARIA, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
        }).formatToParts(new Date());

        const valor = (tipo) => partes.find((p) => p.type === tipo).value;
        const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

        return { dia: dias[valor("weekday")], minutos: Number(valor("hour")) * 60 + Number(valor("minute")) };
    }

    function proximaApertura(dia, minutos) {
        // ¿Abre más tarde hoy?
        const hoy = HORARIOS[dia];
        if (hoy && minutos < aMinutos(hoy.abre)) return `abre hoy ${hoy.abre}`;

        // Buscar el próximo día con horario
        for (let i = 1; i <= 7; i++) {
            const d = (dia + i) % 7;
            if (HORARIOS[d]) {
                const cuando = i === 1 ? "mañana" : `el ${NOMBRES_DIAS[d]}`;
                return `abre ${cuando} ${HORARIOS[d].abre}`;
            }
        }
        return "";
    }

    function actualizarEstado() {
        const caja = document.getElementById("estadoLocal");
        if (!caja) return;

        const { dia, minutos } = ahoraEnArgentina();
        const hoy = HORARIOS[dia];
        const abierto = hoy && minutos >= aMinutos(hoy.abre) && minutos < aMinutos(hoy.cierra);

        caja.dataset.estado = abierto ? "abierto" : "cerrado";
        // En celular solo se ve .estado-texto ("Abierto" / "Cerrado");
        // en computadora se suma el detalle.
        caja.querySelector(".estado-texto").textContent = abierto ? "Abierto" : "Cerrado";
        caja.querySelector(".estado-detalle").textContent = abierto
            ? `ahora · cierra ${hoy.cierra}`
            : `· ${proximaApertura(dia, minutos)}`;
        caja.title = abierto ? `Abierto hasta las ${hoy.cierra}` : `Cerrado — ${proximaApertura(dia, minutos)}`;
    }

    function iniciar() {
        iniciarMenu();
        actualizarEstado();
        setInterval(actualizarEstado, 60 * 1000); // se actualiza cada minuto
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }

})();
