import { API_TURNOS } from "../core/config.js";
import { postDatos } from "../core/api.js";

const formulario = document.getElementById("formTurno");

const selectCliente = document.getElementById("cliente");
const selectEmpleado = document.getElementById("empleado");
const selectServicio = document.getElementById("servicio");

export async function crearTurno(e) {

    e.preventDefault();

    const cliente_id = selectCliente.value;
    const empleado_id = selectEmpleado.value;
    const servicio_id = selectServicio.value;

    // #fecha es datetime-local: ya trae fecha + hora juntas ("2026-07-25T14:30")
    const fecha = document.getElementById("fecha").value;

    if (!cliente_id || !empleado_id || !servicio_id || !fecha) {

        alert("Completá todos los campos");

        return;

    }

    const turno = {
        cliente_id: Number(cliente_id),
        empleado_id: Number(empleado_id),
        servicio_id: Number(servicio_id),
        fecha: fecha.replace("T", " ") // Postgres prefiere "YYYY-MM-DD HH:MM"
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

        // turnos.js ya llama a cargarTurnos() después de este await,
        // no hace falta refrescar acá adentro.

    } catch (error) {

        console.error(error);

        alert("No se pudo crear el turno");

    }

}