import { getDatos } from "../core/api.js";
import { API_TURNOS } from "../core/config.js";
import { EMPLEADO_ID, EMPLEADO_NOMBRE, iniciales, pintarTopbar } from "./common.js";

init();

async function init() {
    pintarTopbar();

    document.getElementById("perfil-avatar").textContent = iniciales(EMPLEADO_NOMBRE);
    document.getElementById("perfil-nombre").textContent = EMPLEADO_NOMBRE;
    document.getElementById("dato-nombre").textContent = EMPLEADO_NOMBRE;

    try {
        const turnos = await getDatos(API_TURNOS);
        const turnosEmpleado = turnos.filter(t => t.empleado_id === EMPLEADO_ID);
        document.getElementById("dato-turnos-totales").textContent = turnosEmpleado.length;
    } catch (err) {
        console.error("Error cargando datos del perfil:", err);
        document.getElementById("dato-turnos-totales").textContent = "—";
    }
}