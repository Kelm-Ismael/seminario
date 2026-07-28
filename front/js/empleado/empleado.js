import { API_EMPLEADOS } from "../core/config.js";

const tbody = document.getElementById("tabla-empleados");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formEmpleado");
const btnVolver = document.getElementById("btnVolver");

if (btnVolver) {
    btnVolver.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}

if (formulario) {
    formulario.addEventListener("submit", crearEmpleado);
}

async function crearEmpleado(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    if (!nombre.trim()) {
        alert("El nombre es obligatorio");
        return;
    }

    const empleado = { nombre, telefono, email };

    try {

        const response = await fetch(API_EMPLEADOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(empleado)
        });

        if (!response.ok) {
            throw new Error("Error al crear el empleado");
        }

        await response.json();

        alert("Empleado creado correctamente");

        formulario.reset();

        obtenerEmpleados();

    } catch (error) {

        console.error(error);

        alert("No se pudo crear el empleado");

    }

}

document.addEventListener("DOMContentLoaded", obtenerEmpleados);

async function obtenerEmpleados() {

    try {

        const response = await fetch(API_EMPLEADOS);

        if (!response.ok) {
            throw new Error("Error al obtener los empleados");
        }

        const empleados = await response.json();

        mostrarEmpleados(empleados);

    } catch (error) {

        console.error(error);

        if (mensaje) mensaje.textContent = "Error al cargar los empleados.";

    }

}

function mostrarEmpleados(empleados) {

    if (!tbody) return;

    tbody.innerHTML = "";

    if (empleados.length === 0) {
        if (mensaje) mensaje.style.display = "block";
        return;
    }

    if (mensaje) mensaje.style.display = "none";

    empleados.forEach(empleado => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${empleado.id_empleados}</td>
            <td>${empleado.nombre}</td>
            <td>${empleado.telefono ?? "-"}</td>
            <td>${empleado.email ?? "-"}</td>
            <td>
                <button class="eliminar" data-id="${empleado.id_empleados}">🗑️</button>
            </td>
        `;

        tbody.appendChild(tr);

    });

}

// Baja lógica (activo = false, mismo criterio que usa el backend)
document.addEventListener("click", async (e) => {

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

            obtenerEmpleados();

        } catch (error) {

            console.error(error);
            alert("No se pudo eliminar el empleado");

        }

    }

});