//importa la funcion del repository
import { error } from "node:console";
import { crearCliente as crearClienteRepository } from "../../infrastructure/repositories/cliente.repository";

//funcion principal del caso de uso

export const crearCliente = async (
    nombre: string,
    telefono: string,
    email: string,
    created_at: string

) => {
    //validacion simple / trim elimina espacion vacio
    if (!nombre.trim()) {//=> lanzar error si esta vacio

    throw new Error("El nombre es obligatorio");
}

//llama a repositorio p/guardar en DB
const clienteCreado = await crearClienteRepository(
    nombre,
    telefono,
    email,  
    created_at


    
);

return clienteCreado; // devuelve cliente creado

};


