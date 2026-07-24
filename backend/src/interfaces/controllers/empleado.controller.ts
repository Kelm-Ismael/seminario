import { Request, Response } from "express";

import { crearEmpleadoCasoDeUso } from "../../aplication/use-cases/crearEmpleado";
import { obtenerEmpleados } from "../../infrastructure/repositories/obtenerEmpleados";
import { obtenerEmpleadoPorId } from "../../infrastructure/repositories/obtenerEmpleadoPorId";
import { actualizarEmpleado } from "../../infrastructure/repositories/actualizarEmpleado";
import { eliminarEmpleado } from "../../infrastructure/repositories/eliminarEmpleado";

// Controller para crear empleado
// Controller para crear empleado
export const crearEmpleadoController = async (
    req: Request,
    res: Response
) => {
    try {

        const { nombre, telefono, email } = req.body;

        const nuevoEmpleado = await crearEmpleadoCasoDeUso(
            nombre, telefono, email
        );

        res.status(201).json(nuevoEmpleado);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error al crear el empleado" });

    }
};

// Controller para obtener todos los empleados
export const obtenerEmpleadosController = async (
    req: Request,
    res: Response
) => {
    try {

        const empleados = await obtenerEmpleados();

        res.status(200).json(empleados);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error al obtener empleados" });

    }
};

// Controller para obtener un empleado por id
export const obtenerEmpleadoPorIdController = async (
    req: Request,
    res: Response
) => {
    try {

        const id = Number(req.params.id);

        const empleado = await obtenerEmpleadoPorId(id);

        if (!empleado) {
            res.status(404).json({ message: "Empleado no encontrado" });
            return;
        }

        res.status(200).json(empleado);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error al obtener el empleado" });

    }
};

// Controller para actualizar un empleado
export const actualizarEmpleadoController = async (
    req: Request,
    res: Response
) => {
    try {

        const id = Number(req.params.id);
        const { nombre, telefono, email } = req.body;

        const empleadoActualizado = await actualizarEmpleado(
            id, nombre, telefono, email
        );

        if (!empleadoActualizado) {
            res.status(404).json({ message: "Empleado no encontrado" });
            return;
        }

        res.status(200).json(empleadoActualizado);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error al actualizar el empleado" });

    }
};

// Controller para eliminar (dar de baja) un empleado
export const eliminarEmpleadoController = async (
    req: Request,
    res: Response
) => {
    try {

        const id = Number(req.params.id);

        const empleadoEliminado = await eliminarEmpleado(id);

        if (!empleadoEliminado) {
            res.status(404).json({ message: "Empleado no encontrado" });
            return;
        }

        res.status(200).json({ message: "Empleado eliminado correctamente" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error al eliminar el empleado" });

    }
};