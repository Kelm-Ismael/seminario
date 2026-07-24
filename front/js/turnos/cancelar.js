import { API_TURNOS } from "./api.js";

export async function cancelarTurno(id) {

    const respuesta = await fetch(`${API_TURNOS}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            estado: "cancelado"
        })
    });

    if (!respuesta.ok) {
        throw new Error("Error al cancelar turno");
    }

    return await respuesta.json();
}