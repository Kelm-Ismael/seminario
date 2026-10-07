import { getDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS, API_EMPLEADOS, API_CLIENTES } from "../core/config.js";
import {
    indexarPorId, esHoy, inicioDeSemana,
    formatoHora, formatoMoneda, capitalizar, pintarTopbar, inicializarShell,
} from "./common.js";

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const TOP_SERVICIOS = 5;

init();

async function init() {
    pintarTopbar();
    inicializarShell();

    try {
        const [turnos, servicios, empleados, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_EMPLEADOS),
            getDatos(API_CLIENTES),
        ]);

        const serviciosPorId = indexarPorId(servicios, "id_servicios");
        const empleadosPorId = indexarPorId(empleados, "id_empleados");
        const clientesPorId = indexarPorId(clientes, "id_clientes");
        const turnosHoy = turnos.filter(t => esHoy(t.fecha));

        pintarStats(turnosHoy, serviciosPorId);
        pintarAgenda(turnosHoy, serviciosPorId, clientesPorId, empleadosPorId);
        pintarChartSemana(turnos, serviciosPorId);
        pintarRankingServicios(turnos, serviciosPorId);

    } catch (err) {
        console.error("Error cargando el resumen de secretaría:", err);
        document.getElementById("agenda-lista").innerHTML =
            `<p class="dato-fila"><span class="label">No se pudo cargar la agenda. Probá recargar la página.</span></p>`;
        document.getElementById("ranking-servicios").innerHTML =
            `<p class="dato-fila"><span class="label">No se pudo cargar el ranking.</span></p>`;
    }
}

function pintarStats(turnosHoy, serviciosPorId) {
    const confirmados = turnosHoy.filter(t => t.estado === "confirmado" || t.estado === "finalizado");
    const cancelados = turnosHoy.filter(t => t.estado === "cancelado");
    const ingresosHoy = confirmados.reduce((total, t) => total + precioDe(t, serviciosPorId), 0);
    const clientesAtendidos = new Set(turnosHoy.map(t => t.cliente_id)).size;

    document.getElementById("stat-turnos-hoy").textContent = turnosHoy.length;
    document.getElementById("stat-confirmados").textContent = confirmados.length;
    document.getElementById("stat-cancelados").textContent = cancelados.length;
    document.getElementById("stat-ingresos-hoy").textContent = formatoMoneda(ingresosHoy);
    document.getElementById("stat-clientes-atendidos").textContent = clientesAtendidos;
}

function pintarAgenda(turnosHoy, serviciosPorId, clientesPorId, empleadosPorId) {
    const contenedor = document.getElementById("agenda-lista");
    const vacio = document.getElementById("agenda-vacio");
    const ordenados = [...turnosHoy].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (ordenados.length === 0) { vacio.style.display = ""; return; }
    vacio.style.display = "none";

    contenedor.innerHTML = ordenados.map(t => {
        const servicio = serviciosPorId[t.servicio_id];
        const cliente = clientesPorId[t.cliente_id];
        const empleado = empleadosPorId[t.empleado_id];
        return `
        <div class="turno-item turno-item--${t.estado}">
            <div class="fecha-box"><div class="dia-num">${formatoHora(t.fecha)}</div></div>
            <div class="info">
                <h4>${cliente ? cliente.nombre : "Cliente sin datos"}</h4>
                <p>${servicio ? servicio.nombre : "Servicio sin datos"}</p>
                <p class="empleado">${empleado ? empleado.nombre : "Empleado sin datos"}</p>
                <p>${capitalizar(t.estado)}</p>
            </div>
            <div class="precio">${servicio ? formatoMoneda(servicio.precio) : "-"}</div>
        </div>`;
    }).join("");
}

function pintarChartSemana(turnos, serviciosPorId) {
    const contenedor = document.getElementById("chart-semana");
    const inicio = inicioDeSemana(new Date());
    const hoy = new Date();

    const ingresosPorDia = Array(7).fill(0);

    turnos
        .filter(t => t.estado === "confirmado" || t.estado === "finalizado")
        .forEach(t => {
            const fecha = new Date(t.fecha);
            const offset = Math.floor((fecha - inicio) / 86400000);
            if (offset >= 0 && offset < 7) {
                ingresosPorDia[offset] += precioDe(t, serviciosPorId);
            }
        });

    const maximo = Math.max(...ingresosPorDia, 1);

    contenedor.innerHTML = ingresosPorDia.map((valor, i) => {
        const fechaDia = new Date(inicio);
        fechaDia.setDate(inicio.getDate() + i);
        const esHoyDia = fechaDia.toDateString() === hoy.toDateString();
        const alturaPct = Math.max(3, Math.round((valor / maximo) * 100));
        return `
        <div class="chart-bar-wrap">
            <span class="chart-bar-valor">${valor > 0 ? formatoMoneda(valor) : ""}</span>
            <div class="chart-bar ${esHoyDia ? "hoy" : ""}" style="height:${alturaPct}%"></div>
            <span class="chart-bar-label">${DIAS_SEMANA[i]}</span>
        </div>`;
    }).join("");
}

function pintarRankingServicios(turnos, serviciosPorId) {
    const contenedor = document.getElementById("ranking-servicios");
    const conteos = {};

    turnos
        .filter(t => t.estado !== "cancelado")
        .forEach(t => {
            conteos[t.servicio_id] = (conteos[t.servicio_id] || 0) + 1;
        });

    const ranking = Object.entries(conteos)
        .map(([servicioId, cantidad]) => ({ servicio: serviciosPorId[servicioId], cantidad }))
        .filter(item => item.servicio)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, TOP_SERVICIOS);

    if (ranking.length === 0) {
        contenedor.innerHTML = `<p class="dato-fila"><span class="label">Todavía no hay turnos registrados.</span></p>`;
        return;
    }

    const maximo = ranking[0].cantidad;

    contenedor.innerHTML = ranking.map(item => `
        <div class="ranking-item">
            <div class="ranking-info">
                <span class="ranking-nombre">${item.servicio.nombre}</span>
                <span class="ranking-count">${item.cantidad}</span>
            </div>
            <div class="progreso-barra"><div class="relleno" style="width:${Math.round((item.cantidad / maximo) * 100)}%"></div></div>
        </div>
    `).join("");
}

function precioDe(turno, serviciosPorId) {
    const servicio = serviciosPorId[turno.servicio_id];
    return servicio && servicio.precio ? Number(servicio.precio) : 0;
}