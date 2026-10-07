import { getDatos, postDatos } from "../core/api.js";
import { API_CLIENTES, API_TURNOS } from "../core/config.js";
import { pintarTopbar, inicializarShell } from "./common.js";

// Recepcionista: puede registrar clientes nuevos (alta básica) y
// consultarlos, pero NO editarlos ni eliminarlos (backlog, Escenario 25/26).
// Este archivo no cambió respecto al original — ya cumplía la regla.

let todosLosClientes = [];
let conteoTurnosPorCliente = {};

init();

async function init() {
    pintarTopbar();
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Alta y listado completo de clientes";

    document.getElementById("form-cliente").addEventListener("submit", onCrearCliente);
    document.getElementById("buscar-cliente").addEventListener("input", renderizar);

    await cargarDatos();
}

async function cargarDatos() {
    try {
        const [clientes, turnos] = await Promise.all([
            getDatos(API_CLIENTES),
            getDatos(API_TURNOS),
        ]);

        todosLosClientes = clientes;

        conteoTurnosPorCliente = {};
        turnos.forEach(t => {
            conteoTurnosPorCliente[t.cliente_id] = (conteoTurnosPorCliente[t.cliente_id] || 0) + 1;
        });

        renderizar();

    } catch (err) {
        console.error("Error cargando clientes:", err);
        document.getElementById("tabla-clientes").innerHTML =
            `<tr><td colspan="4">No se pudieron cargar los clientes. Probá recargar la página.</td></tr>`;
    }
}

async function onCrearCliente(ev) {
    ev.preventDefault();

    const datos = {
        nombre: document.getElementById("cliente-nombre").value.trim(),
        telefono: document.getElementById("cliente-telefono").value.trim(),
        email: document.getElementById("cliente-email").value.trim(),
    };

    if (!datos.nombre) {
        alert("El nombre es obligatorio.");
        return;
    }

    try {
        const response = await postDatos(API_CLIENTES, datos);
        if (!response.ok) throw new Error("Error al crear cliente");

        document.getElementById("form-cliente").reset();
        await cargarDatos();

    } catch (err) {
        console.error(err);
        alert("No se pudo crear el cliente.");
    }
}

function renderizar() {
    const texto = document.getElementById("buscar-cliente").value.trim().toLowerCase();

    const filtrados = todosLosClientes.filter(c => {
        if (!texto) return true;
        return (c.nombre || "").toLowerCase().includes(texto)
            || (c.telefono || "").toLowerCase().includes(texto)
            || (c.email || "").toLowerCase().includes(texto);
    });

    const tabla = document.getElementById("tabla-clientes");
    const vacio = document.getElementById("clientes-vacio");

    if (filtrados.length === 0) {
        tabla.innerHTML = "";
        vacio.style.display = "";
        return;
    }
    vacio.style.display = "none";

    tabla.innerHTML = filtrados.map(c => `
        <tr>
            <td>${c.nombre}</td>
            <td>${c.telefono || "-"}</td>
            <td>${c.email || "-"}</td>
            <td>${conteoTurnosPorCliente[c.id_clientes] || 0}</td>
        </tr>
    `).join("");
}
