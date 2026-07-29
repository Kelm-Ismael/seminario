const API = "https://seminario-production-627f.up.railway.app/cliente/clientes";
//para localhost nomas
// const API = "http://localhost:3000/cliente/clientes";

import { API_CLIENTES } from "../core/config.js";

const API = API_CLIENTES;

const tbody = document.getElementById("tabla-clientes");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formCliente");
const btnVolver = document.getElementById("btnVolver");

let clientesActuales = [];
let editandoId = null;

const btnSubmit = formulario.querySelector("button.btn-primary");

if (btnVolver) {
    btnVolver.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}

formulario.addEventListener("submit", guardarCliente);

document.addEventListener("DOMContentLoaded", obtenerClientes);

async function guardarCliente(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const created_at = document.getElementById("created_at").value;

    if (!nombre.trim()) {
        alert("El nombre es obligatorio");
        return;
    }

    const cliente = {
        nombre,
        telefono,
        email,
        created_at
    };

    try {

        const url = editandoId
            ? `${API}/${editandoId}`
            : API;

        const method = editandoId
            ? "PUT"
            : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error("Error al guardar");
        }

        await response.json();

        alert(editandoId ? "Cliente actualizado" : "Cliente creado");

        cancelarEdicion();

        obtenerClientes();

    } catch (error) {

        console.error(error);
        alert("No se pudo guardar el cliente");

    }

}

async function obtenerClientes() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Error al obtener clientes");
        }

        clientesActuales = await response.json();

        mostrarClientes(clientesActuales);

    } catch (error) {

        console.error(error);

        if (mensaje) {
            mensaje.textContent = "Error al cargar los clientes.";
        }

    }

}

function mostrarClientes(clientes) {

    if (!tbody) return;

    tbody.innerHTML = "";

    if (clientes.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No hay clientes registrados
                </td>
            </tr>
        `;

        return;
    }

    clientes.forEach(cliente => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.telefono ?? "-"}</td>
            <td>${cliente.email ?? "-"}</td>
            <td>${cliente.created_at ?? "-"}</td>

            <td>
                <button
                    type="button"
                    class="editar"
                    data-id="${cliente.id_clientes}">
                    ✏️
                </button>

                <button
                    type="button"
                    class="eliminar"
                    data-id="${cliente.id_clientes}">
                    🗑️
                </button>
            </td>
        `;

        tbody.appendChild(tr);

    });

}

function entrarModoEdicion(cliente) {

    editandoId = cliente.id_clientes;

    document.getElementById("nombre").value = cliente.nombre;
    document.getElementById("telefono").value = cliente.telefono ?? "";
    document.getElementById("email").value = cliente.email ?? "";
    document.getElementById("created_at").value = cliente.created_at ?? "";

    btnSubmit.textContent = "Actualizar cliente";

    formulario.scrollIntoView({
        behavior: "smooth"
    });

}

function cancelarEdicion() {

    editandoId = null;

    formulario.reset();

    btnSubmit.textContent = "Guardar cliente";

}

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("editar")) {

        const id = e.target.dataset.id;

        const cliente = clientesActuales.find(
            c => String(c.id_clientes) === String(id)
        );

        if (cliente) {
            entrarModoEdicion(cliente);
        }

    }

    if (e.target.classList.contains("eliminar")) {

        const id = e.target.dataset.id;

        if (!confirm("¿Eliminar cliente?")) return;

        try {

            const response = await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar");
            }

            if (editandoId == id) {
                cancelarEdicion();
            }

            obtenerClientes();

        } catch (error) {

            console.error(error);

            alert("No se pudo eliminar el cliente");

        }

    }

});