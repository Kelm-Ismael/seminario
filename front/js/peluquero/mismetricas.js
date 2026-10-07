import { getDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS } from "../core/config.js";
import {
    EMPLEADO_ID, indexarPorId, esEstaSemana, formatoMoneda, pintarTopbar, inicializarShell,
} from "./common.js";

const META_CLIENTES = 20;
const META_SERVICIOS = 20;
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

init();

async function init() {
    pintarTopbar();
    inicializarShell();

    try {
        const [turnos, servicios] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
        ]);

        const serviciosPorId = indexarPorId(servicios, "id_servicios");
        const turnosEmpleado = turnos.filter(t => t.empleado_id === EMPLEADO_ID);
        const finalizados = turnosEmpleado.filter(t => t.estado === "finalizado");

        pintarResumen(turnosEmpleado, finalizados, serviciosPorId);
        pintarIngresosPorMes(finalizados, serviciosPorId);
        pintarEstaSemana(turnosEmpleado, serviciosPorId);

    } catch (err) {
        console.error("Error cargando métricas:", err);
        document.getElementById("barras-mensuales").innerHTML =
            `<p class="dato-fila"><span class="label">No se pudieron cargar las métricas.</span></p>`;
    }
}

function pintarResumen(turnosEmpleado, finalizados, serviciosPorId) {
    const clientesDistintos = new Set(finalizados.map(t => t.cliente_id)).size;
    const ingresosTotales = finalizados.reduce((total, t) => total + (serviciosPorId[t.servicio_id]?.precio ? Number(serviciosPorId[t.servicio_id].precio) : 0), 0);

    document.getElementById("stat-turnos-totales").textContent = turnosEmpleado.length;
    document.getElementById("stat-finalizados").textContent = finalizados.length;
    document.getElementById("stat-clientes-distintos").textContent = clientesDistintos;
    document.getElementById("stat-ingresos-totales").textContent = formatoMoneda(ingresosTotales);
}

function pintarIngresosPorMes(finalizados, serviciosPorId) {
    const hoy = new Date();
    const meses = [];

    // Últimos 6 meses, incluyendo el actual
    for (let i = 5; i >= 0; i--) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        meses.push({ anio: fecha.getFullYear(), mes: fecha.getMonth(), total: 0 });
    }

    for (const t of finalizados) {
        const fecha = new Date(t.fecha);
        const bucket = meses.find(m => m.anio === fecha.getFullYear() && m.mes === fecha.getMonth());
        if (!bucket) continue;
        const servicio = serviciosPorId[t.servicio_id];
        bucket.total += servicio ? Number(servicio.precio) : 0;
    }

    const maximo = Math.max(1, ...meses.map(m => m.total));
    const contenedor = document.getElementById("barras-mensuales");

    contenedor.innerHTML = meses.map(m => {
        const alturaPct = Math.max(4, Math.round((m.total / maximo) * 100));
        return `
        <div class="barra-mes">
            <span class="valor">${m.total > 0 ? formatoMoneda(m.total) : "-"}</span>
            <div class="relleno" style="height:${alturaPct}%;"></div>
            <span class="etiqueta">${MESES[m.mes]}</span>
        </div>`;
    }).join("");
}

function pintarEstaSemana(turnosEmpleado, serviciosPorId) {
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