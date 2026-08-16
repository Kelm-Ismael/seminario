import { getDatos } from "../core/api.js";
import { API_EMPLEADOS, API_TURNOS } from "../core/config.js";
import { pintarTopbar, inicializarShell } from "./common.js";

// Recepcionista: SOLO CONSULTA la lista de empleados, para saber a quién
// asignarle un turno. El alta, edición y baja de personal son exclusivas
// de Administrador (ver backlog, Escenario 39).

let todosLosEmpleados = [];
let conteoTurnosPorEmpleado = {};

init();

async function init() {
    pintarTopbar();
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Listado del personal (solo lectura)";

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
            `<tr><td colspan="2">No se pudieron cargar los empleados. Probá recargar la página.</td></tr>`;
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

    tabla.innerHTML = filtrados.map(e => `
        <tr>
            <td>${e.nombre}</td>
            <td>${conteoTurnosPorEmpleado[e.id_empleados] || 0}</td>
        </tr>
    `).join("");
}
