import { Request, Response } from "express"; // importar tipos de express

import { crearCliente } from "../../aplication/use-cases/crearCliente"; //impoortar caso de uso
// Importamos función repository
import { obtenerClientes } from "../../infrastructure/repositories/obtenerClientes";



//controller para crear cliente
export const crearClienteController = async (
    req : Request,
    res: Response
) => {
    try { 
    //exportamos datos enviados desde frontend
    //req.body contiene el JSON recibido

    const { nombre, telefono, email, created_at } = req.body;

    //ejecutamos la logica del caso de uso
    const nuevoCliente = await crearCliente(
        nombre, telefono, email, created_at
    );
    
    //respodemos con status 201 creado 
    res.status(201).json(nuevoCliente);
    
    } catch (error) {

        //responde a error si algo falla
        res.status(500).json({message:"Error al crear el cliente"});
    }
};



// Controller para obtener clientes
export const obtenerClientesController = async (
  req: Request,
  res: Response
) => {

  try {

    // Obtenemos clientes desde DB
    const clientes = await obtenerClientes();

    // Respondemos con JSON
    res.status(200).json(clientes);

  } catch (error) {

    // Error del servidor
    res.status(500).json({
      message: "Error al obtener clientes"
    });
  }
};