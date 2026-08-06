import { getDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS, API_CLIENTES } from "../core/config.js";
import {
    EMPLEADO_ID, indexarPorId, formatoMoneda, capitalizar, pintarTopbar, inicializarShell,
} from "./common.js";

let turnosPasados = [];
let serviciosPorId = {};
let clientesPorId = {};

init();

async function init() {
    pintarTopbar();
    inicializarShell();

    try {
        const [turnos, servicios, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_CLIENTES),
        ]);

        serviciosPorId = indexarPorId(servicios, "id_servicios");
        clientesPorId = indexarPorId(clientes, "id_clientes");

        const ahora = new Date();
        turnosPasados = turnos
            .filter(t => t.empleado_id === EMPLEADO_ID)
            .filter(t => t.estado === "finalizado" || t.estado === "cancelado" || new Date(t.fecha) < ahora)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        pintarTabla(turnosPasados);
        activarTabs();

    } catch (err) {
        console.error("Error cargando el historial:", err);
        document.getElementById("historial-tbody").innerHTML =
            `<tr><td colspan="5">No se pudo cargar el historial.</td></tr>`;
    }
}

function activarTabs() {
    document.getElementById("historial-tabs").addEventListener("click", (ev) => {
        const boton = ev.target.closest(".tab");
        if (!boton) return;

        document.querySelectorAll("#historial-tabs .tab").forEach(t => t.classList.remove("active"));
        boton.classList.add("active");

        const estado = boton.dataset.estado;
        const filtrados = estado === "todos" ? turnosPasados : turnosPasados.filter(t => t.estado === estado);
        pintarTabla(filtrados);
    });
}

function pintarTabla(lista) {
    const tbody = document.getElementById("historial-tbody");

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No hay turnos para mostrar.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(t => {
        const servicio = serviciosPorId[t.servicio_id];
        const cliente = clientesPorId[t.cliente_id];
        const fecha = new Date(t.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

        return `
        <tr>
            <td>${fecha}</td>
            <td>${cliente ? cliente.nombre : "Cliente sin datos"}</td>
            <td>${servicio ? servicio.nombre : "Servicio sin datos"}</td>
            <td>${servicio ? formatoMoneda(servicio.precio) : "-"}</td>
            <td><span class="badge-${t.estado}">${capitalizar(t.estado)}</span></td>
        </tr>`;
    }).join("");
}