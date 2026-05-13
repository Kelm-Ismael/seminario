// //import axios from "axios";

// const API = "http://localhost:3000/turnos";

// // export const crearTurnoApi = async (datos: any) => {
// //   const respuesta = await axios.post(API, datos);
// //   return respuesta.data;
// // };

// //funcion async para crear cliente
// export const crearTurnoApi = async (turnos: {
//     cliente: string;
//     empleado: string;
//     servicio: string;
//     fecha: string;
// }) => {
//     //fetch para hacer peticion HTTP

//     const respuesta = await fetch(API,{
//         //METODO POST para crear datos
//         method: "POST",

//         //headers indican que envia JSON
//         headers: {
//             "content-Type": "application/json",
//         },
//         // body convierte JS a JSON
//         body: JSON.stringify(turnos),
//     });
//     //convertimos respuesta a JSON
//     const data = await respuesta.json();
//     //retornamos datos

//     return data;
    
// };

// // Función para obtener clientes
// export const obtenerTurnos = async () => {

//   // Petición GET
//   const respuesta = await fetch(API);

//   // Convertimos respuesta a JSON
//   const data = await respuesta.json();

//   // Retornamos datos
//   return data;
// };

// URL backend
const API = "http://localhost:3000/turnos";


// función para crear turno
export const crearTurnoApi = async (turno: {

  cliente_id: number;

  empleado_id: number;

  servicio_id: number;

  fecha: string;

  estado: string;

}) => {

  // petición POST
  const respuesta = await fetch(API, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    // convertimos objeto a JSON
    body: JSON.stringify(turno),
  });

  // convertimos respuesta
  const data = await respuesta.json();

  return data;
};


// función GET turnos
export const obtenerTurnos = async () => {

  const respuesta = await fetch(API);

  const data = await respuesta.json();

  return data;
};