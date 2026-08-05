import { getDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS, API_CLIENTES } from "../core/config.js";
import {
    EMPLEADO_ID, indexarPorId, esHoy, esEstaSemana,
    formatoHora, formatoMoneda, capitalizar, pintarTopbar,
} from "./common.js";

const META_CLIENTES = 20;
const META_SERVICIOS = 20;

init();

async function init() {
    pintarTopbar();

    try {
        const [turnos, servicios, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_CLIENTES),
        ]);

        const turnosEmpleado = turnos.filter(t => t.empleado_id === EMPLEADO_ID);
        const serviciosPorId = indexarPorId(servicios, "id_servicios");
        const clientesPorId = indexarPorId(clientes, "id_clientes");
        const turnosHoy = turnosEmpleado.filter(t => esHoy(t.fecha));

        pintarStats(turnosHoy, serviciosPorId);
        pintarAgenda(turnosHoy, serviciosPorId, clientesPorId);
        pintarProximoTurno(turnosEmpleado, serviciosPorId, clientesPorId);
        pintarMetricas(turnosEmpleado, serviciosPorId);

    } catch (err) {
        console.error("Error cargando el dashboard del peluquero:", err);
        document.getElementById("agenda-lista").innerHTML =
            `<p class="dato-fila"><span class="label">No se pudo cargar la agenda. Probá recargar la página.</span></p>`;
    }
}

function pintarStats(turnosHoy, serviciosPorId) {
    const confirmados = turnosHoy.filter(t => t.estado === "confirmado" || t.estado === "finalizado");
    const cancelados = turnosHoy.filter(t => t.estado === "cancelado");
    const ingresosHoy = confirmados.reduce((total, t) => total + (serviciosPorId[t.servicio_id]?.precio ? Number(serviciosPorId[t.servicio_id].precio) : 0), 0);

    document.getElementById("stat-turnos-hoy").textContent = turnosHoy.length;
    document.getElementById("stat-confirmados").textContent = confirmados.length;
    document.getElementById("stat-cancelados").textContent = cancelados.length;
    document.getElementById("stat-ingresos-hoy").textContent = formatoMoneda(ingresosHoy);
}

function pintarAgenda(turnosHoy, serviciosPorId, clientesPorId) {
    const contenedor = document.getElementById("agenda-lista");
    const vacio = document.getElementById("agenda-vacio");
    const ordenados = [...turnosHoy].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (ordenados.length === 0) { vacio.style.display = ""; return; }
    vacio.style.display = "none";

    contenedor.innerHTML = ordenados.map(t => {
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

function pintarProximoTurno(turnosEmpleado, serviciosPorId, clientesPorId) {
    const contenedor = document.getElementById("proximo-turno");
    const ahora = new Date();
    const proximo = turnosEmpleado
        .filter(t => new Date(t.fecha) >= ahora && t.estado !== "cancelado")
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];

    if (!proximo) {
        contenedor.innerHTML = `<p class="dato-fila"><span class="label">No tenés próximos turnos.</span></p>`;
        return;
    }

    const servicio = serviciosPorId[proximo.servicio_id];
    const cliente = clientesPorId[proximo.cliente_id];
    contenedor.innerHTML = `
        <div class="turno-fecha-box"><div class="hora">${formatoHora(proximo.fecha)}</div></div>
        <div class="turno-info">
            <h4>${cliente ? cliente.nombre : "Cliente sin datos"}</h4>
            <p>${servicio ? servicio.nombre : "Servicio sin datos"}</p>
            <p>${capitalizar(proximo.estado)}</p>
        </div>`;
}

function pintarMetricas(turnosEmpleado, serviciosPorId) {
    const finalizadosSemana = turnosEmpleado.filter(t => t.estado === "finalizado" && esEstaSemana(t.fecha));
    const clientesUnicos = new Set(finalizadosSemana.map(t => t.cliente_id)).size;
    const ingresosSemana = finalizadosSemana.reduce((total, t) => total + (serviciosPorId[t.servicio_id]?.precio ? Number(serviciosPorId[t.servicio_id].precio) : 0), 0);

    actualizarBarra("clientes", clientesUnicos, META_CLIENTES);
    actualizarBarra("servicios", finalizadosSemana.length, META_SERVICIOS);
    document.getElementById("metrica-ingresos-semana").textContent = formatoMoneda(ingresosSemana);
}

function actualizarBarra(prefijo, valor, meta) {
    const pct = Math.min(100, Math.round((valor / meta) * 100));
    document.getElementById(`metrica-${prefijo}-txt`).textContent = `${valor} / ${meta}`;
    document.getElementById(`metrica-${prefijo}-barra`).style.width = `${pct}%`;
}