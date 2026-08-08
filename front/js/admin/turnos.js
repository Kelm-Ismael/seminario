import { getDatos, postDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS, API_EMPLEADOS, API_CLIENTES } from "../core/config.js";
import {
    indexarPorId, formatoHora, formatoFechaCorta, formatoMoneda, capitalizar,
    pintarTopbar, inicializarShell, cambiarEstadoTurno, eliminarTurno,
} from "./common.js";

const ESTADOS = ["pendiente", "confirmado", "finalizado", "cancelado"];

let todosLosTurnos = [];
let serviciosPorId = {};
let empleadosPorId = {};
let clientesPorId = {};

init();

async function init() {
    pintarTopbar();
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Alta y gestión de todos los turnos";

    document.getElementById("form-turno").addEventListener("submit", onCrearTurno);
    document.getElementById("buscar-turno").addEventListener("input", renderizar);
    document.getElementById("filtro-estado-turno").addEventListener("change", renderizar);

    await cargarDatos();
}

async function cargarDatos() {
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

        pintarSelect("turno-cliente", clientes, "id_clientes", "nombre");
        pintarSelect("turno-empleado", empleados, "id_empleados", "nombre");
        pintarSelect("turno-servicio", servicios, "id_servicios", "nombre");

        renderizar();

    } catch (err) {
        console.error("Error cargando turnos:", err);
        document.getElementById("tabla-turnos").innerHTML =
            `<tr><td colspan="8">No se pudieron cargar los turnos. Probá recargar la página.</td></tr>`;
    }
}

function pintarSelect(idSelect, lista, campoId, campoNombre) {
    const select = document.getElementById(idSelect);
    lista.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item[campoId];
        opt.textContent = item[campoNombre];
        select.appendChild(opt);
    });
}

async function onCrearTurno(ev) {
    ev.preventDefault();

    const datos = {
        cliente_id: Number(document.getElementById("turno-cliente").value),
        empleado_id: Number(document.getElementById("turno-empleado").value),
        servicio_id: Number(document.getElementById("turno-servicio").value),
        fecha: document.getElementById("turno-fecha").value,
    };

    if (!datos.cliente_id || !datos.empleado_id || !datos.servicio_id || !datos.fecha) {
        alert("Completá todos los campos.");
        return;
    }

    try {
        const response = await postDatos(API_TURNOS, datos);

        if (response.status === 409) {
            const data = await response.json();
            alert(data.message || "Ese empleado ya tiene un turno en ese horario.");
            return;
        }
        if (!response.ok) throw new Error("Error al crear turno");

        document.getElementById("form-turno").reset();
        await cargarDatos();

    } catch (err) {
        console.error(err);
        alert("No se pudo crear el turno.");
    }
}

function renderizar() {
    const texto = document.getElementById("buscar-turno").value.trim().toLowerCase();
    const estadoFiltro = document.getElementById("filtro-estado-turno").value;

    const filtrados = todosLosTurnos
        .filter(t => !estadoFiltro || t.estado === estadoFiltro)
        .filter(t => !texto || coincideTexto(t, texto))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const tabla = document.getElementById("tabla-turnos");
    const vacio = document.getElementById("turnos-vacio");

    if (filtrados.length === 0) {
        tabla.innerHTML = "";
        vacio.style.display = "";
        return;
    }
    vacio.style.display = "none";

    tabla.innerHTML = filtrados.map(t => filaTurno(t)).join("");

    tabla.querySelectorAll("select.select-estado").forEach(sel => {
        sel.addEventListener("change", onCambiarEstado);
    });
    tabla.querySelectorAll("button.btn-eliminar-turno").forEach(btn => {
        btn.addEventListener("click", onEliminarTurno);
    });
}

function coincideTexto(t, texto) {
    const cliente = clientesPorId[t.cliente_id]?.nombre?.toLowerCase() || "";
    const empleado = empleadosPorId[t.empleado_id]?.nombre?.toLowerCase() || "";
    const servicio = serviciosPorId[t.servicio_id]?.nombre?.toLowerCase() || "";
    return cliente.includes(texto) || empleado.includes(texto) || servicio.includes(texto);
}

function filaTurno(t) {
    const servicio = serviciosPorId[t.servicio_id];
    const empleado = empleadosPorId[t.empleado_id];
    const cliente = clientesPorId[t.cliente_id];

    return `
    <tr data-id="${t.id_turnos}">
        <td>${formatoFechaCorta(t.fecha)}</td>
        <td>${formatoHora(t.fecha)}</td>
        <td>${cliente ? cliente.nombre : "Cliente sin datos"}</td>
        <td>${empleado ? empleado.nombre : "Empleado sin datos"}</td>
        <td>${servicio ? servicio.nombre : "Servicio sin datos"}</td>
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