import { getDatos } from "../core/api.js";
import { API_TURNOS, API_CLIENTES } from "../core/config.js";
import { EMPLEADO_ID, iniciales, pintarTopbar } from "./common.js";

let listaClientes = [];

init();

async function init() {
    pintarTopbar();

    try {
        const [turnos, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_CLIENTES),
        ]);

        const clientesPorId = {};
        for (const c of clientes) clientesPorId[c.id_clientes] = c;

        const turnosEmpleado = turnos.filter(t => t.empleado_id === EMPLEADO_ID);

        // Cuenta cuántos turnos tuvo cada cliente con este empleado
        const conteoPorCliente = {};
        for (const t of turnosEmpleado) {
            conteoPorCliente[t.cliente_id] = (conteoPorCliente[t.cliente_id] || 0) + 1;
        }

        listaClientes = Object.keys(conteoPorCliente)
            .map(id => clientesPorId[id])
            .filter(Boolean)
            .map(c => ({ ...c, cantidadTurnos: conteoPorCliente[c.id_clientes] }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

        pintarClientes(listaClientes);
        document.getElementById("buscador-clientes").addEventListener("input", onBuscar);

    } catch (err) {
        console.error("Error cargando clientes:", err);
        document.getElementById("clientes-grid").innerHTML =
            `<p class="dato-fila"><span class="label">No se pudo cargar la lista de clientes.</span></p>`;
    }
}

function onBuscar(ev) {
    const termino = ev.target.value.trim().toLowerCase();
    const filtrados = listaClientes.filter(c => c.nombre.toLowerCase().includes(termino));
    pintarClientes(filtrados);
}

function pintarClientes(lista) {
    const contenedor = document.getElementById("clientes-grid");

    if (lista.length === 0) {
        contenedor.innerHTML = `<p class="dato-fila"><span class="label">No se encontraron clientes.</span></p>`;
        return;
    }

    contenedor.innerHTML = lista.map(c => `
        <div class="cliente-card">
            <div class="avatar-initials avatar-md">${iniciales(c.nombre)}</div>
            <h4>${c.nombre}</h4>
            <p>${c.telefono || "Sin teléfono"}</p>
            <p>${c.email || "Sin email"}</p>
            <span class="cliente-turnos-count">${c.cantidadTurnos} turno${c.cantidadTurnos === 1 ? "" : "s"} con vos</span>
        </div>
    `).join("");
}