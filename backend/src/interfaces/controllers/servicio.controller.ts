import { Request, Response } from "express";

import { crearServicioCasoDeUso } from "../../aplication/use-cases/crearServicio";
import { obtenerServicios } from "../../infrastructure/repositories/obtenerServicios";
import { obtenerServicioPorId } from "../../infrastructure/repositories/obtenerServicioPorId";
import { actualizarServicio } from "../../infrastructure/repositories/actualizarServicio";
import { eliminarServicio } from "../../infrastructure/repositories/eliminarServicio";

// Controller para crear servicio
export const crearServicioController = async (
    req: Request,
    res: Response
) => {
    try {

        const { nombre, precio, duracion } = req.body;

        const nuevoServicio = await crearServicioCasoDeUso(
            nombre, precio, duracion
        );

        res.status(201).json(nuevoServicio);

    } catch (error) {

        res.status(500).json({ message: "Error al crear el servicio" });

    }
};

// Controller para obtener todos los servicios
export const obtenerServiciosController = async (
    req: Request,
    res: Response
) => {
    try {

        const servicios = await obtenerServicios();

        res.status(200).json(servicios);

    } catch (error) {

        res.status(500).json({ message: "Error al obtener servicios" });

    }
};

// Controller para obtener un servicio por id
export const obtenerServicioPorIdController = async (
    req: Request,
    res: Response
) => {
    try {

        const id = Number(req.params.id);

        const servicio = await obtenerServicioPorId(id);

        if (!servicio) {
            res.status(404).json({ message: "Servicio no encontrado" });
            return;
        }

        res.status(200).json(servicio);

    } catch (error) {

        res.status(500).json({ message: "Error al obtener el servicio" });

    }
};

// Controller para actualizar un servicio
export const actualizarServicioController = async (
    req: Request,
    res: Response
) => {
    try {

        const id = Number(req.params.id);
        const { nombre, precio, duracion } = req.body;

        const servicioActualizado = await actualizarServicio(
            id, nombre, precio, duracion
        );

        if (!servicioActualizado) {
            res.status(404).json({ message: "Servicio no encontrado" });
            return;
        }

        res.status(200).json(servicioActualizado);

    } catch (error) {

        res.status(500).json({ message: "Error al actualizar el servicio" });

    }
};

// Controller para eliminar (dar de baja) un servicio
export const eliminarServicioController = async (
    req: Request,
    res: Response
) => {
    try {

        const id = Number(req.params.id);

        const servicioEliminado = await eliminarServicio(id);

        if (!servicioEliminado) {
            res.status(404).json({ message: "Servicio no encontrado" });
            return;
        }

        res.status(200).json({ message: "Servicio eliminado correctamente" });

    } catch (error) {

        res.status(500).json({ message: "Error al eliminar el servicio" });

    }
};