import { getDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS, API_CLIENTES } from "../core/config.js";
import {
    EMPLEADO_ID, indexarPorId, esMismoDia,
    formatoHora, formatoMoneda, formatoFechaLarga, capitalizar, pintarTopbar,
} from "./common.js";

let turnosEmpleado = [];
let serviciosPorId = {};
let clientesPorId = {};
let fechaSeleccionada = new Date();

init();

async function init() {
    pintarTopbar();

    try {
        const [turnos, servicios, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_CLIENTES),
        ]);

        turnosEmpleado = turnos.filter(t => t.empleado_id === EMPLEADO_ID);
        serviciosPorId = indexarPorId(servicios, "id_servicios");
        clientesPorId = indexarPorId(clientes, "id_clientes");

        pintarDia();
        activarControles();

    } catch (err) {
        console.error("Error cargando la agenda:", err);
        document.getElementById("agenda-lista").innerHTML =
            `<p class="dato-fila"><span class="label">No se pudo cargar la agenda. Probá recargar la página.</span></p>`;
    }
}

function activarControles() {
    document.getElementById("btn-dia-anterior").addEventListener("click", () => cambiarDia(-1));
    document.getElementById("btn-dia-siguiente").addEventListener("click", () => cambiarDia(1));
    document.getElementById("btn-hoy").addEventListener("click", () => {
        fechaSeleccionada = new Date();
        pintarDia();
    });

    document.getElementById("agenda-tabs").addEventListener("click", (ev) => {
        const boton = ev.target.closest(".tab");
        if (!boton) return;

        document.querySelectorAll("#agenda-tabs .tab").forEach(t => t.classList.remove("active"));
        boton.classList.add("active");

        const esSemana = boton.dataset.vista === "semana";
        document.getElementById("vista-dia").style.display = esSemana ? "none" : "";
        document.getElementById("vista-semana").style.display = esSemana ? "" : "none";
        document.getElementById("agenda-toolbar").style.display = esSemana ? "none" : "flex";
    });
}

function cambiarDia(delta) {
    fechaSeleccionada = new Date(fechaSeleccionada);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + delta);
    pintarDia();
}

function pintarDia() {
    document.getElementById("agenda-fecha-actual").textContent = formatoFechaLarga(fechaSeleccionada);

    const contenedor = document.getElementById("agenda-lista");
    const vacio = document.getElementById("agenda-vacio");

    const turnosDia = turnosEmpleado
        .filter(t => esMismoDia(t.fecha, fechaSeleccionada))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (turnosDia.length === 0) {
        contenedor.innerHTML = "";
        vacio.style.display = "";
        contenedor.appendChild(vacio);
        return;
    }
    vacio.style.display = "none";

    contenedor.innerHTML = turnosDia.map(t => {
        const servicio = serviciosPorId[t.servicio_id];
        const cliente = clientesPorId[t.cliente_id];
        return `
        <div class="turno-item turno-item--${t.estado}">
            <div class="fecha-box"><div class="dia-num">${formatoHora(t.fecha)}</div></div>
            <div class="info">
                <h4>${cliente ? cliente.nombre : "Cliente sin datos"}</h4>
                <p>${servicio ? servicio.nombre : "Servicio sin datos"}</p>
                <p>${capitalizar(t.estado)}</p>
            </div>
            <div class="precio">${servicio ? formatoMoneda(servicio.precio) : "-"}</div>
        </div>`;
    }).join("");
}