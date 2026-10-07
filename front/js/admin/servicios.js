import { getDatos, postDatos, putDatos, deleteDatos } from "../core/api.js";
import { API_SERVICIOS } from "../core/config.js";
import { formatoMoneda, pintarTopbar, inicializarShell } from "./common.js";

let todosLosServicios = [];
let idEnEdicion = null;

init();

async function init() {
    pintarTopbar();
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Catálogo de servicios del negocio";

    document.getElementById("form-servicio").addEventListener("submit", onCrearServicio);
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
            `<tr><td colspan="4">No se pudieron cargar los servicios. Probá recargar la página.</td></tr>`;
    }
}

async function onCrearServicio(ev) {
    ev.preventDefault();

    const datos = {
        nombre: document.getElementById("servicio-nombre").value.trim(),
        precio: Number(document.getElementById("servicio-precio").value),
        duracion: Number(document.getElementById("servicio-duracion").value),
    };

    if (!datos.nombre || !datos.precio || !datos.duracion) {
        alert("Completá todos los campos.");
        return;
    }

    try {
        const response = await postDatos(API_SERVICIOS, datos);
        if (!response.ok) throw new Error("Error al crear servicio");

        document.getElementById("form-servicio").reset();
        await cargarDatos();

    } catch (err) {
        console.error(err);
        alert("No se pudo crear el servicio.");
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

    tabla.innerHTML = filtrados.map(s => {
        return s.id_servicios === idEnEdicion ? filaEdicion(s) : filaNormal(s);
    }).join("");

    tabla.querySelectorAll("button.btn-editar-servicio").forEach(btn => {
        btn.addEventListener("click", () => { idEnEdicion = Number(btn.dataset.id); renderizar(); });
    });
    tabla.querySelectorAll("button.btn-eliminar-servicio").forEach(btn => {
        btn.addEventListener("click", onEliminarServicio);
    });
    tabla.querySelectorAll("button.btn-guardar-servicio").forEach(btn => {
        btn.addEventListener("click", onGuardarEdicion);
    });
    tabla.querySelectorAll("button.btn-cancelar-edicion").forEach(btn => {
        btn.addEventListener("click", () => { idEnEdicion = null; renderizar(); });
    });
}

function filaNormal(s) {
    return `
    <tr data-id="${s.id_servicios}">
        <td>${s.nombre}</td>
        <td>${formatoMoneda(s.precio)}</td>
        <td>${s.duracion} min</td>
        <td class="tabla-acciones">
            <button type="button" class="btn-icon btn-editar-servicio" data-id="${s.id_servicios}" title="Editar">✎</button>
            <button type="button" class="btn-icon danger btn-eliminar-servicio" data-id="${s.id_servicios}" title="Eliminar">🗑</button>
        </td>
    </tr>`;
}

function filaEdicion(s) {
    return `
    <tr class="editando" data-id="${s.id_servicios}">
        <td><input type="text" id="edit-nombre-${s.id_servicios}" value="${s.nombre}"></td>
        <td><input type="number" id="edit-precio-${s.id_servicios}" value="${s.precio}" min="0"></td>
        <td><input type="number" id="edit-duracion-${s.id_servicios}" value="${s.duracion}" min="0"></td>
        <td class="tabla-acciones">
            <button type="button" class="btn-icon btn-guardar-servicio" data-id="${s.id_servicios}" title="Guardar">✔</button>
            <button type="button" class="btn-icon btn-cancelar-edicion" title="Cancelar">✕</button>
        </td>
    </tr>`;
}

async function onGuardarEdicion(ev) {
    const id = Number(ev.currentTarget.dataset.id);

    const datos = {
        nombre: document.getElementById(`edit-nombre-${id}`).value.trim(),
        precio: Number(document.getElementById(`edit-precio-${id}`).value),
        duracion: Number(document.getElementById(`edit-duracion-${id}`).value),
    };

    if (!datos.nombre || !datos.precio || !datos.duracion) {
        alert("Completá todos los campos.");
        return;
    }

    try {
        // Nota: no tengo el controller real, mando el objeto completo por
        // las dudas. Si el backend espera solo los campos modificados,
        // avisar para ajustar.
        const response = await putDatos(`${API_SERVICIOS}/${id}`, datos);
        if (!response.ok) throw new Error("Error al actualizar servicio");

        idEnEdicion = null;
        await cargarDatos();

    } catch (err) {
        console.error(err);
        alert("No se pudo guardar el servicio.");
    }
}

async function onEliminarServicio(ev) {
    const id = ev.currentTarget.dataset.id;
    if (!confirm("¿Eliminar este servicio del catálogo?")) return;

    try {
        const response = await deleteDatos(`${API_SERVICIOS}/${id}`);
        if (!response.ok) throw new Error("Error al eliminar servicio");

        todosLosServicios = todosLosServicios.filter(s => String(s.id_servicios) !== String(id));
        renderizar();

    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el servicio.");
    }
}