import { API_SERVICIOS } from "../core/config.js";

const tbody = document.getElementById("tabla-servicios");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formServicio");
const btnVolver = document.getElementById("btnVolver");

if (btnVolver) {
    btnVolver.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}

if (formulario) {
    formulario.addEventListener("submit", crearServicio);
}

async function crearServicio(e) {

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

    const servicio = { nombre, precio, duracion };

    try {

        const response = await fetch(API_SERVICIOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(servicio)
        });

        if (!response.ok) {
            throw new Error("Error al crear el servicio");
        }

        await response.json();

        alert("Servicio creado correctamente");

        formulario.reset();

        obtenerServicios();

    } catch (error) {

        console.error(error);

        alert("No se pudo crear el servicio");

    }

}

document.addEventListener("DOMContentLoaded", obtenerServicios);

async function obtenerServicios() {

    try {

        const response = await fetch(API_SERVICIOS);

        if (!response.ok) {
            throw new Error("Error al obtener los servicios");
        }

        const servicios = await response.json();

        mostrarServicios(servicios);

    } catch (error) {

        console.error(error);

        if (mensaje) mensaje.textContent = "Error al cargar los servicios.";

    }

}

function mostrarServicios(servicios) {

    if (!tbody) return;

    tbody.innerHTML = "";

    if (servicios.length === 0) {
        if (mensaje) mensaje.style.display = "block";
        return;
    }

    if (mensaje) mensaje.style.display = "none";

    servicios.forEach(servicio => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${servicio.id_servicios}</td>
            <td>${servicio.nombre}</td>
            <td>$${servicio.precio}</td>
            <td>${servicio.duracion} min</td>
            <td>
                <button class="eliminar" data-id="${servicio.id_servicios}">🗑️</button>
            </td>
        `;

        tbody.appendChild(tr);

    });

}

document.addEventListener("click", async (e) => {

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

            obtenerServicios();

        } catch (error) {

            console.error(error);
            alert("No se pudo eliminar el servicio");

        }

    }

});