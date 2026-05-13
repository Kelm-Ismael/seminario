// importar useState de react
import { useState, useEffect } from "react";

// import { crearTurnoApi } from "../api/turnos";
import { crearTurnoApi, obtenerTurnos } from "../api/turnos";

// export const useTurnos = () => {
//     const crear = async (datos: any) => {
//         return await crearTurnoApi(datos);
//     };

//     return {crear};
// };


// Hook personalizado
export const useTurnos = () => {

    // estado para guardar turnos
    const [turnos, setTurnos] = useState<any[]>([]);

    // funcion para crear turnos
    const crear = async (datos:any) => {

        // llamamos API
        const nuevoTurno= await crearTurnoApi(datos);
        // actualizamos estado
    
        setTurnos([...turnos, nuevoTurno]);

        return nuevoTurno;

    };

    // useEffect se ejecuta al cargar componente
    useEffect(() => {

        // Función async interna
        const cargarTurnos = async () => {

            // Obtenemos turnos desde backend
            const data = await obtenerTurnos();
            console.log(data);
            // Guardamos en estado
            setTurnos(data);
        };

        // Ejecutamos función
        cargarTurnos();

    }, []);

    // retornamos datos y funciones
    return {
        turnos: turnos,
        crear,
    };

    
};

// // importar hooks de react
// import { useState, useEffect } from "react";

// // importar funciones API
// import {
//   crearTurnoApi,
//   obtenerTurnos
// } from "../api/turnos";


// // Hook personalizado de turnos
// export const useTurnos = () => {

//   // estado para guardar turnos
//   const [turnos, setTurnos] = useState<any[]>([]);


//   // función para crear turno
//   const crear = async (datos: any) => {

//     // llamamos backend
//     const nuevoTurno =
//       await crearTurnoApi(datos);

//     // actualizamos estado
//     setTurnos([
//       ...turnos,
//       nuevoTurno
//     ]);

//     return nuevoTurno;
//   };


//   // useEffect al cargar componente
//   useEffect(() => {

//     // función interna async
//     const cargarTurnos = async () => {

//       // obtenemos turnos
//       const data = await obtenerTurnos();

//       console.log(data);

//       // guardamos en estado
//       setTurnos(data);
//     };

//     // ejecutar función
//     cargarTurnos();

//   }, []);


//   // retornamos estado y funciones
//   return {
//     turnos,
//     crear,
//   };
// };