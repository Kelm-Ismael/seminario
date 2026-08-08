import { API_SERVICIOS } from "../core/config.js";

const tbody = document.getElementById("tablaServicios");
const formulario = document.getElementById("formServicio");
const btnSubmit = formulario.querySelector("button.btn-primary");

let serviciosActuales = [];
let editandoId = null;

formulario.addEventListener("submit", guardarServicio);

async function guardarServicio(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const precio = Number(document.getElementById("precio").value);
    const duracion = Number(document.getElementById("duracion").value);

    if (!nombre.trim()) {
        alert("El nombre es obligatorio");
        return;
    }

    if (precio < 0) {
        alert("El precio no puede ser negativo");
        return;
    }

    if (duracion <= 0) {
        alert("La duración debe ser mayor a 0");
        return;
    }

    const datos = { nombre, precio, duracion };

    try {

        const url = editandoId
            ? `${API_SERVICIOS}/${editandoId}`
            : API_SERVICIOS;

        const method = editandoId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(editandoId ? "Error al actualizar" : "Error al crear el servicio");
        }

        await response.json();

        alert(editandoId ? "Servicio actualizado" : "Servicio creado correctamente");

        cancelarEdicion();

        obtenerServicios();

    } catch (error) {

        console.error(error);
        alert(editandoId ? "No se pudo actualizar el servicio" : "No se pudo crear el servicio");

    }

}

function entrarModoEdicion(servicio) {

    editandoId = servicio.id_servicios;

    document.getElementById("nombre").value = servicio.nombre;
    document.getElementById("precio").value = servicio.precio;
    document.getElementById("duracion").value = servicio.duracion;

    btnSubmit.textContent = "Actualizar servicio";

    formulario.scrollIntoView({ behavior: "smooth" });

}

function cancelarEdicion() {

    editandoId = null;

    formulario.reset();

    btnSubmit.textContent = "Guardar servicio";

}

document.addEventListener("DOMContentLoaded", obtenerServicios);

async function obtenerServicios() {

    try {

        const response = await fetch(API_SERVICIOS);

        if (!response.ok) {
            throw new Error("Error al obtener los servicios");
        }

        serviciosActuales = await response.json();

        mostrarServicios(serviciosActuales);

    } catch (error) {

        console.error(error);

        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5">Error al cargar los servicios.</td></tr>`;
        }

    }

}

function mostrarServicios(servicios) {

    if (!tbody) return;

    tbody.innerHTML = "";

    if (servicios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No hay servicios registrados</td></tr>`;
        return;
    }

    servicios.forEach(servicio => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${servicio.nombre}</td>
            <td>$${servicio.precio}</td>
            <td>${servicio.duracion} min</td>
            <td>Activo</td>
            <td>
                <button type="button" class="editar" data-id="${servicio.id_servicios}">✏️</button>
                <button type="button" class="eliminar" data-id="${servicio.id_servicios}">🗑️</button>
            </td>
        `;

        tbody.appendChild(tr);

    });

}

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("editar")) {

        const id = e.target.dataset.id;

        const servicio = serviciosActuales.find(
            s => String(s.id_servicios) === String(id)
        );

        if (servicio) entrarModoEdicion(servicio);

    }

    if (e.target.classList.contains("eliminar")) {

        const id = e.target.dataset.id;

        if (!confirm("¿Dar de baja este servicio?")) return;

        try {

            const response = await fetch(`${API_SERVICIOS}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar");
            }

            if (editandoId === id) cancelarEdicion();

            obtenerServicios();

        } catch (error) {

            console.error(error);
            alert("No se pudo eliminar el servicio");

        }

    }

});