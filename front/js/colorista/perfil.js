import { getDatos } from "../core/api.js";
import { API_TURNOS } from "../core/config.js";
import {
    EMPLEADO_ID, EMPLEADO_NOMBRE, iniciales, pintarTopbar,
    inicializarShell, obtenerFotoPerfilGuardada,
} from "./common.js";

init();

async function init() {
    pintarTopbar();
    inicializarShell();

    document.getElementById("perfil-avatar").textContent = iniciales(EMPLEADO_NOMBRE);
    document.getElementById("perfil-nombre").textContent = EMPLEADO_NOMBRE;
    document.getElementById("dato-nombre").textContent = EMPLEADO_NOMBRE;

    const fotoGuardada = obtenerFotoPerfilGuardada();
    if (fotoGuardada) {
        const img = document.getElementById("perfil-avatar-img");
        img.src = fotoGuardada;
        img.style.display = "";
        document.getElementById("perfil-avatar").style.display = "none";
    }

    document.getElementById("btn-cambiar-foto-perfil").addEventListener("click", () => {
        document.getElementById("user-avatar-input").click();
    });

    try {
        const turnos = await getDatos(API_TURNOS);
        const turnosEmpleado = turnos.filter(t => t.empleado_id === EMPLEADO_ID);
        document.getElementById("dato-turnos-totales").textContent = turnosEmpleado.length;
    } catch (err) {
        console.error("Error cargando datos del perfil:", err);
        document.getElementById("dato-turnos-totales").textContent = "—";
    }
}