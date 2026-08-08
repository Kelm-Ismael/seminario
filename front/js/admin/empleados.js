import { getDatos, postDatos, putDatos, deleteDatos } from "../core/api.js";
import { API_EMPLEADOS, API_TURNOS } from "../core/config.js";
import { pintarTopbar, inicializarShell } from "./common.js";

let todosLosEmpleados = [];
let conteoTurnosPorEmpleado = {};
let idEnEdicion = null;

init();

async function init() {
    pintarTopbar();
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Alta y listado del personal";

    document.getElementById("form-empleado").addEventListener("submit", onCrearEmpleado);
    document.getElementById("buscar-empleado").addEventListener("input", renderizar);

    await cargarDatos();
}

async function cargarDatos() {
    try {
        const [empleados, turnos] = await Promise.all([
            getDatos(API_EMPLEADOS),
            getDatos(API_TURNOS),
        ]);

        todosLosEmpleados = empleados;

        conteoTurnosPorEmpleado = {};
        turnos.forEach(t => {
            conteoTurnosPorEmpleado[t.empleado_id] = (conteoTurnosPorEmpleado[t.empleado_id] || 0) + 1;
        });

        renderizar();

    } catch (err) {
        console.error("Error cargando empleados:", err);
        document.getElementById("tabla-empleados").innerHTML =
            `<tr><td colspan="3">No se pudieron cargar los empleados. Probá recargar la página.</td></tr>`;
    }
}

async function onCrearEmpleado(ev) {
    ev.preventDefault();

    const nombre = document.getElementById("empleado-nombre").value.trim();
    if (!nombre) {
        alert("El nombre es obligatorio.");
        return;
    }

    try {
        const response = await postDatos(API_EMPLEADOS, { nombre });
        if (!response.ok) throw new Error("Error al crear empleado");

        document.getElementById("form-empleado").reset();
        await cargarDatos();

    } catch (err) {
        console.error(err);
        alert("No se pudo crear el empleado.");
    }
}

function renderizar() {
    const texto = document.getElementById("buscar-empleado").value.trim().toLowerCase();
    const filtrados = todosLosEmpleados.filter(e => !texto || e.nombre.toLowerCase().includes(texto));

    const tabla = document.getElementById("tabla-empleados");
    const vacio = document.getElementById("empleados-vacio");

    if (filtrados.length === 0) {
        tabla.innerHTML = "";
        vacio.style.display = "";
        return;
    }
    vacio.style.display = "none";

    tabla.innerHTML = filtrados.map(e => {
        return e.id_empleados === idEnEdicion ? filaEdicion(e) : filaNormal(e);
    }).join("");

    tabla.querySelectorAll("button.btn-editar-empleado").forEach(btn => {
        btn.addEventListener("click", () => { idEnEdicion = Number(btn.dataset.id); renderizar(); });
    });
    tabla.querySelectorAll("button.btn-eliminar-empleado").forEach(btn => {
        btn.addEventListener("click", onEliminarEmpleado);
    });
    tabla.querySelectorAll("button.btn-guardar-empleado").forEach(btn => {
        btn.addEventListener("click", onGuardarEdicion);
    });
    tabla.querySelectorAll("button.btn-cancelar-edicion").forEach(btn => {
        btn.addEventListener("click", () => { idEnEdicion = null; renderizar(); });
    });
}

function filaNormal(e) {
    return `
    <tr data-id="${e.id_empleados}">
        <td>${e.nombre}</td>
        <td>${conteoTurnosPorEmpleado[e.id_empleados] || 0}</td>
        <td class="tabla-acciones">
            <button type="button" class="btn-icon btn-editar-empleado" data-id="${e.id_empleados}" title="Editar">✎</button>
            <button type="button" class="btn-icon danger btn-eliminar-empleado" data-id="${e.id_empleados}" title="Eliminar">🗑</button>
        </td>
    </tr>`;
}

function filaEdicion(e) {
    return `
    <tr class="editando" data-id="${e.id_empleados}">
        <td><input type="text" id="edit-nombre-emp-${e.id_empleados}" value="${e.nombre}"></td>
        <td>${conteoTurnosPorEmpleado[e.id_empleados] || 0}</td>
        <td class="tabla-acciones">
            <button type="button" class="btn-icon btn-guardar-empleado" data-id="${e.id_empleados}" title="Guardar">✔</button>
            <button type="button" class="btn-icon btn-cancelar-edicion" title="Cancelar">✕</button>
        </td>
    </tr>`;
}

async function onGuardarEdicion(ev) {
    const id = Number(ev.currentTarget.dataset.id);
    const nombre = document.getElementById(`edit-nombre-emp-${id}`).value.trim();

    if (!nombre) {
        alert("El nombre es obligatorio.");
        return;
    }

    try {
        // Mismo comentario que en servicios: no tengo el controller real,
        // mando el objeto completo. Ajustar si el backend espera otra cosa.
        const response = await putDatos(`${API_EMPLEADOS}/${id}`, { nombre });
        if (!response.ok) throw new Error("Error al actualizar empleado");

        idEnEdicion = null;
        await cargarDatos();

    } catch (err) {
        console.error(err);
        alert("No se pudo guardar el empleado.");
    }
}

async function onEliminarEmpleado(ev) {
    const id = ev.currentTarget.dataset.id;
    if (!confirm("¿Eliminar este empleado?")) return;

    try {
        const response = await deleteDatos(`${API_EMPLEADOS}/${id}`);
        if (!response.ok) throw new Error("Error al eliminar empleado");

        todosLosEmpleados = todosLosEmpleados.filter(e => String(e.id_empleados) !== String(id));
        renderizar();

    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el empleado.");
    }
}