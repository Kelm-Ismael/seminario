import { getDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS, API_EMPLEADOS, API_CLIENTES } from "../core/config.js";
import {
    indexarPorId, esMismoDia, formatoHora, formatoFechaLarga, formatoMoneda,
    capitalizar, claseBadgeEstado, pintarTopbar, inicializarShell,
    cambiarEstadoTurno, eliminarTurno,
} from "./common.js";

const ESTADOS = ["pendiente", "confirmado", "finalizado", "cancelado"];

let fechaSeleccionada = new Date();
let todosLosTurnos = [];
let serviciosPorId = {};
let empleadosPorId = {};
let clientesPorId = {};

init();

async function init() {
    pintarTopbar({ tituloFecha: "" });
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Turnos de todos los empleados";

    document.getElementById("btn-dia-anterior").addEventListener("click", () => cambiarDia(-1));
    document.getElementById("btn-dia-siguiente").addEventListener("click", () => cambiarDia(1));
    document.getElementById("btn-hoy").addEventListener("click", () => { fechaSeleccionada = new Date(); renderizar(); });
    document.getElementById("filtro-empleado").addEventListener("change", renderizar);

    try {
        const [turnos, servicios, empleados, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_EMPLEADOS),
            getDatos(API_CLIENTES),
        ]);

        todosLosTurnos = turnos;
        serviciosPorId = indexarPorId(servicios, "id_servicios");
        empleadosPorId = indexarPorId(empleados, "id_empleados");
        clientesPorId = indexarPorId(clientes, "id_clientes");

        pintarFiltroEmpleados(empleados);
        renderizar();

    } catch (err) {
        console.error("Error cargando la agenda:", err);
        document.getElementById("tabla-agenda").innerHTML =
            `<tr><td colspan="7">No se pudo cargar la agenda. Probá recargar la página.</td></tr>`;
    }
}

function cambiarDia(delta) {
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + delta);
    renderizar();
}

function pintarFiltroEmpleados(empleados) {
    const select = document.getElementById("filtro-empleado");
    empleados.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.id_empleados;
        opt.textContent = e.nombre;
        select.appendChild(opt);
    });
}

function renderizar() {
    document.getElementById("fecha-actual").textContent = formatoFechaLarga(fechaSeleccionada);

    const empleadoFiltro = document.getElementById("filtro-empleado").value;

    const turnosDia = todosLosTurnos
        .filter(t => esMismoDia(t.fecha, fechaSeleccionada))
        .filter(t => !empleadoFiltro || String(t.empleado_id) === empleadoFiltro)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const tabla = document.getElementById("tabla-agenda");
    const vacio = document.getElementById("agenda-vacio");

    if (turnosDia.length === 0) {
        tabla.innerHTML = "";
        vacio.style.display = "";
        return;
    }
    vacio.style.display = "none";

    tabla.innerHTML = turnosDia.map(t => filaTurno(t)).join("");

    tabla.querySelectorAll("select.select-estado").forEach(sel => {
        sel.addEventListener("change", onCambiarEstado);
    });
    tabla.querySelectorAll("button.btn-eliminar-turno").forEach(btn => {
        btn.addEventListener("click", onEliminarTurno);
    });
}

function filaTurno(t) {
    const servicio = serviciosPorId[t.servicio_id];
    const empleado = empleadosPorId[t.empleado_id];
    const cliente = clientesPorId[t.cliente_id];

    return `
    <tr data-id="${t.id_turnos}">
        <td>${formatoHora(t.fecha)}</td>
        <td>${cliente ? cliente.nombre : "Cliente sin datos"}</td>
        <td>${servicio ? servicio.nombre : "Servicio sin datos"}</td>
        <td>${empleado ? empleado.nombre : "Empleado sin datos"}</td>
        <td>${servicio ? formatoMoneda(servicio.precio) : "-"}</td>
        <td>
            <select class="select-estado" data-id="${t.id_turnos}">
                ${ESTADOS.map(e => `<option value="${e}" ${e === t.estado ? "selected" : ""}>${capitalizar(e)}</option>`).join("")}
            </select>
        </td>
        <td class="tabla-acciones">
            <button type="button" class="btn-icon danger btn-eliminar-turno" data-id="${t.id_turnos}" title="Eliminar turno">🗑</button>
        </td>
    </tr>`;
}

async function onCambiarEstado(ev) {
    const id = ev.target.dataset.id;
    const nuevoEstado = ev.target.value;
    try {
        await cambiarEstadoTurno(id, nuevoEstado);
        const turno = todosLosTurnos.find(t => String(t.id_turnos) === String(id));
        if (turno) turno.estado = nuevoEstado;
    } catch (err) {
        console.error(err);
        alert("No se pudo actualizar el estado del turno.");
        renderizar();
    }
}

async function onEliminarTurno(ev) {
    const id = ev.currentTarget.dataset.id;
    if (!confirm("¿Eliminar este turno? Esta acción no se puede deshacer.")) return;
    try {
        await eliminarTurno(id);
        todosLosTurnos = todosLosTurnos.filter(t => String(t.id_turnos) !== String(id));
        renderizar();
    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el turno.");
    }
}