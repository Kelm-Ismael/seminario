import { API_TURNOS } from "../core/config.js";

export async function cancelarTurno(id) {

    const respuesta = await fetch(`${API_TURNOS}/${id}`, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
        throw new Error("Error al cancelar turno");
    }

    return await respuesta.json();
}