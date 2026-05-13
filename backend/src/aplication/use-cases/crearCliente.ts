//importa la funcion del repository
import { error } from "node:console";
import { crearCliente as crearClienteRepository } from "../../infrastructure/repositories/cliente.repository";

//funcion principal del caso de uso

export const crearCliente = async (
    nomnbre: string,
    telefono: string,
    email: string
) => {
    //validacion simple / trim elimina espacion vacio
    if (!nomnbre.trim()) {//=> lanzar error si esta vacio

    throw new Error("El nombre es obligatorio");
}

//llama a repositorio p/guardar en DB
const clienteCreado = await crearClienteRepository(
    nomnbre,
    telefono,
    email
);

return clienteCreado; // devuelve cliente creado

};
