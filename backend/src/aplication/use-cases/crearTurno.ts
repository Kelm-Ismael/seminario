import { crearTurno } from "../../infrastructure/repositories/turno.repository";
import { existeTurnoEnHorario } from "../../infrastructure/repositories/turno.repository";

//cliente con el mismo id y fecha/hora no puede reservar otro turno
export const CrearTurnoCasoDeUso = async (datos: any) => {

    const { empleado_id, fecha } = datos;

    const choque = await existeTurnoEnHorario(empleado_id, fecha);

    if (choque) {
        throw new Error("El empleado ya tiene un turno en ese horario");
    }

    return await crearTurno(datos);
};