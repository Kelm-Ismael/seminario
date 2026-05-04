// import { crearTurnoApi } from "../api/turnos";
import { crearTurnoApi } from "../api/turnos";

export const useTurnos = () => {
    const crear = async (datos: any) => {
        return await crearTurnoApi(datos);
    };

    return {crear};
};