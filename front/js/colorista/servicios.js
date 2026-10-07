import { getDatos } from "../core/api.js";
import { API_SERVICIOS } from "../core/config.js";
import { formatoMoneda, pintarTopbar, inicializarShell } from "./common.js";

init();

async function init() {
    pintarTopbar();
    inicializarShell();

    try {
        const servicios = await getDatos(API_SERVICIOS);
        pintarServicios(servicios);
    } catch (err) {
        console.error("Error cargando servicios:", err);
        document.getElementById("servicios-grid").innerHTML =
            `<p class="dato-fila"><span class="label">No se pudo cargar el catálogo de servicios.</span></p>`;
    }
}

function pintarServicios(servicios) {
    const contenedor = document.getElementById("servicios-grid");

    if (servicios.length === 0) {
        contenedor.innerHTML = `<p class="dato-fila"><span class="label">Todavía no hay servicios cargados.</span></p>`;
        return;
    }

    contenedor.innerHTML = servicios.map(s => `
        <div class="service-card">
            <div class="icon">✂️</div>
            <h4>${s.nombre}</h4>
            <p>${s.duracion} min · ${formatoMoneda(s.precio)}</p>
        </div>
    `).join("");
}