import {
    actualizarTurno as actualizarTurnoRepository,
    existeTurnoEnHorario
} from "../../infrastructure/repositories/turno.repository";

const ESTADOS_VALIDOS = ["pendiente", "confirmado", "cancelado", "finalizado"];

export const actualizarTurnoCasoDeUso = async (
    id: number,
    empleado_id: number,
    fecha: string,
    estado: string
) => {

    if (!ESTADOS_VALIDOS.includes(estado)) {
        throw new Error("Estado inválido");
    }

    const choque = await existeTurnoEnHorario(empleado_id, fecha, id);

    if (choque) {
        throw new Error("El empleado ya tiene un turno en ese horario");
    }

    const turnoActualizado = await actualizarTurnoRepository(id, fecha, estado);

    return turnoActualizado;
};