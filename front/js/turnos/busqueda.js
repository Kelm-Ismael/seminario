import { API_TURNOS } from "./api.js";


export async function buscarTurnos() {

    const respuesta = await fetch(API_TURNOS);


    if (!respuesta.ok) {
        throw new Error("Error al obtener turnos");
    }


    return await respuesta.json();
}