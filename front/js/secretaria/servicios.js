import { getDatos } from "../core/api.js";
import { API_SERVICIOS } from "../core/config.js";
import { formatoMoneda, pintarTopbar, inicializarShell } from "./common.js";

// Recepcionista: SOLO CONSULTA el catálogo de servicios. El alta, la
// edición de precios/duración y la baja son exclusivas de Administrador
// (ver backlog, Escenario 41 — "Es el único rol que puede fijar precios").

let todosLosServicios = [];

init();

async function init() {
    pintarTopbar();
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Catálogo de servicios del negocio (solo lectura)";

    document.getElementById("buscar-servicio").addEventListener("input", renderizar);

    await cargarDatos();
}

async function cargarDatos() {
    try {
        todosLosServicios = await getDatos(API_SERVICIOS);
        renderizar();
    } catch (err) {
        console.error("Error cargando servicios:", err);
        document.getElementById("tabla-servicios").innerHTML =
            `<tr><td colspan="3">No se pudieron cargar los servicios. Probá recargar la página.</td></tr>`;
    }
}

function renderizar() {
    const texto = document.getElementById("buscar-servicio").value.trim().toLowerCase();
    const filtrados = todosLosServicios.filter(s => !texto || s.nombre.toLowerCase().includes(texto));

    const tabla = document.getElementById("tabla-servicios");
    const vacio = document.getElementById("servicios-vacio");

    if (filtrados.length === 0) {
        tabla.innerHTML = "";
        vacio.style.display = "";
        return;
    }
    vacio.style.display = "none";

    tabla.innerHTML = filtrados.map(s => `
        <tr>
            <td>${s.nombre}</td>
            <td>${formatoMoneda(s.precio)}</td>
            <td>${s.duracion} min</td>
        </tr>
    `).join("");
}
