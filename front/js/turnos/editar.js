import { API_TURNOS } from "../core/config.js";

// datos = { empleado_id, fecha, estado }
export async function editarTurno(id, datos) {

    const respuesta = await fetch(`${API_TURNOS}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error("Error al editar turno");
    }

    return await respuesta.json();
}