import axios from "axios";

const API = "http://localhost:3000/turnos";

export const crearTurnoApi = async (datos: any) => {
  const respuesta = await axios.post(API, datos);
  return respuesta.data;
};
