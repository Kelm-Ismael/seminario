import { API_EMPLEADOS } from "../core/config.js";

const tbody = document.getElementById("tablaEmpleados");
const formulario = document.getElementById("formEmpleado");
const btnSubmit = formulario.querySelector("button.btn-primary");

let empleadosActuales = [];
let editandoId = null;

formulario.addEventListener("submit", guardarEmpleado);

async function guardarEmpleado(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    if (!nombre.trim()) {
        alert("El nombre es obligatorio");
        return;
    }

    const datos = { nombre, telefono, email };

    try {

        const url = editandoId
            ? `${API_EMPLEADOS}/${editandoId}`
            : API_EMPLEADOS;

        const method = editandoId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(editandoId ? "Error al actualizar" : "Error al crear el empleado");
        }

        await response.json();

        alert(editandoId ? "Empleado actualizado" : "Empleado creado correctamente");

        cancelarEdicion();

        obtenerEmpleados();

    } catch (error) {

        console.error(error);
        alert(editandoId ? "No se pudo actualizar el empleado" : "No se pudo crear el empleado");

    }

}

function entrarModoEdicion(empleado) {

    editandoId = empleado.id_empleados;

    document.getElementById("nombre").value = empleado.nombre;
    document.getElementById("telefono").value = empleado.telefono ?? "";
    document.getElementById("email").value = empleado.email ?? "";

    btnSubmit.textContent = "Actualizar empleado";

    formulario.scrollIntoView({ behavior: "smooth" });

}

function cancelarEdicion() {

    editandoId = null;

    formulario.reset();

    btnSubmit.textContent = "Guardar empleado";

}

document.addEventListener("DOMContentLoaded", obtenerEmpleados);

async function obtenerEmpleados() {

    try {

        const response = await fetch(API_EMPLEADOS);

        if (!response.ok) {
            throw new Error("Error al obtener los empleados");
        }

        empleadosActuales = await response.json();

        mostrarEmpleados(empleadosActuales);

    } catch (error) {

        console.error(error);

        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5">Error al cargar los empleados.</td></tr>`;
        }

    }

}

function mostrarEmpleados(empleados) {

    if (!tbody) return;

    tbody.innerHTML = "";

    if (empleados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No hay empleados registrados</td></tr>`;
        return;
    }

    empleados.forEach(empleado => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${empleado.nombre}</td>
            <td>${empleado.telefono ?? "-"}</td>
            <td>${empleado.email ?? "-"}</td>
            <td>Activo</td>
            <td>
                <button type="button" class="editar" data-id="${empleado.id_empleados}">✏️</button>
                <button type="button" class="eliminar" data-id="${empleado.id_empleados}">🗑️</button>
            </td>
        `;

        tbody.appendChild(tr);

    });

}

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("editar")) {

        const id = e.target.dataset.id;

        const empleado = empleadosActuales.find(
            emp => String(emp.id_empleados) === String(id)
        );

        if (empleado) entrarModoEdicion(empleado);

    }

    if (e.target.classList.contains("eliminar")) {

        const id = e.target.dataset.id;

        if (!confirm("¿Dar de baja este empleado?")) return;

        try {

            const response = await fetch(`${API_EMPLEADOS}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar");
            }

            if (editandoId === id) cancelarEdicion();

            obtenerEmpleados();

        } catch (error) {

            console.error(error);
            alert("No se pudo eliminar el empleado");

        }

    }

});