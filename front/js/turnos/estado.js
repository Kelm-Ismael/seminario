import { API_TURNOS } from "./api.js";


export async function cambiarEstadoTurno(id, estado) {

    const respuesta = await fetch(`${API_TURNOS}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            estado
        })
    });


    if (!respuesta.ok) {
        throw new Error("Error al cambiar estado");
    }


    return await respuesta.json();
}