import { crearTurno } from "../../infrastructure/repositories/turno.repository";

export const CrearTurnoCasoDeUso  = async (datos: any) => {
    return await crearTurno(datos);
}