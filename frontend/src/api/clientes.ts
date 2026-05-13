// import axios from "axios";
// import { url } from "inspector";

const URL = "http://localhost:3000/cliente/clientes"; //url del backend

//funcion async para crear cliente
export const crearCliente = async (cliente: {
    nombre: string;
    telefono: string;
    email: string;
}) => {
    //fetch para hacer peticion HTTP

    const respuesta = await fetch(URL,{
        //METODO POST para crear datos
        method: "POST",

        //headers indican que envia JSON
        headers: {
            "content-Type": "application/json",
        },
        // body convierte JS a JSON
        body: JSON.stringify(cliente),
    });
    //convertimos respuesta a JSON
    const data = await respuesta.json();
    //retornamos datos

    return data;
};


// Función para obtener clientes
export const obtenerClientes = async () => {

  // Petición GET
  const respuesta = await fetch(URL);

  // Convertimos respuesta a JSON
  const data = await respuesta.json();

  // Retornamos datos
  return data;
};
