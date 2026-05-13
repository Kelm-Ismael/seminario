// importar useState de react
import { useState, useEffect } from "react";



// importar funcion API
import { crearCliente, obtenerClientes } from "../api/clientes";



// Hook personalizado
export const useClientes = () => {

    // estado para guardar clientes
    const [clientes, setClientes] = useState<any[]>([]);

    // funcion para crear cliente
    const agregarCliente = async (
        nombre: string,
        telefono: string,
        email: string
    ) => {

        // llamamos API
        const nuevoCliente = await crearCliente({
            nombre,
            telefono,
            email,
        });

        // actualizamos estado
        // ...clientes copia array anterior
        setClientes([...clientes, nuevoCliente]);
    };

    // useEffect se ejecuta al cargar componente
    useEffect(() => {

        // Función async interna
        const cargarClientes = async () => {

            // Obtenemos clientes desde backend
            const data = await obtenerClientes();

            // Guardamos en estado
            setClientes(data);
        };

        // Ejecutamos función
        cargarClientes();

    }, []);

    // retornamos datos y funciones
    return {
        clientes,
        agregarCliente,
    };

    
};