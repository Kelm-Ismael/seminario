import { API_TURNOS } from "../core/config.js";
// import { postDatos } from "../core/api.js";
// import { obtenerTurnos } from "./listado.js";

import { postDatos } from "../core/api.js";
import { API_TURNOS } from "../core/config.js";

const formulario = document.getElementById("formTurno");

const selectCliente = document.getElementById("cliente");
const selectEmpleado = document.getElementById("empleado");
const selectServicio = document.getElementById("servicio");

export async function crearTurno(e) {

    e.preventDefault();

    const cliente_id = selectCliente.value;
    const empleado_id = selectEmpleado.value;
    const servicio_id = selectServicio.value;

    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!cliente_id || !empleado_id || !servicio_id || !fecha || !hora) {

        alert("Completá todos los campos");

        return;

    }

    const turno = {

        cliente_id: Number(cliente_id),

        empleado_id: Number(empleado_id),

        servicio_id: Number(servicio_id),

        fecha: `${fecha} ${hora}`

    };

    try {

        const response = await postDatos(API_TURNOS, turno);

        if (response.status === 409) {

            const data = await response.json();

            alert(data.message);

            return;

        }

        if (!response.ok) {

            throw new Error("Error al crear turno");

        }

        await response.json();

        alert("Turno creado correctamente");

        formulario.reset();

        obtenerTurnos();

    } catch (error) {

        console.error(error);

        alert("No se pudo crear el turno");

    }

}