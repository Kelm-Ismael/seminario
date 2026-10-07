import { API_TURNOS } from "../core/config.js";
import { getDatos } from "../core/api.js";



const mensaje = document.getElementById("mensaje");


export async function obtenerTurnos() {

    try {

        const turnos = await getDatos(API_TURNOS);

        return turnos;


    } catch (error) {

        console.error(error);

        if (mensaje) {
            mensaje.textContent =
                "Error al cargar los turnos.";
        }

        return [];

    }

}