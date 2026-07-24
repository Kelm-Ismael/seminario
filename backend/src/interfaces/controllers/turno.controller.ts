import { Request, Response } from "express";
import { CrearTurnoCasoDeUso } from "../../aplication/use-cases/crearTurno";
import { actualizarTurnoCasoDeUso } from "../../aplication/use-cases/actualizarTurno";

import { obtenerTurnos } from "../../infrastructure/repositories/obtenerTurnos";
import {
    obtenerTurnoPorId,
    cancelarTurno
} from "../../infrastructure/repositories/turno.repository";

// Crear turno
export const crearTurnoControlador = async (req: Request, res: Response) => {
  try {
    const turno = await CrearTurnoCasoDeUso(req.body);
    res.status(201).json(turno);
  } catch (error: any) {
    console.error(error);

    // Mensaje de negocio (choque de horario) -> 409 Conflict
    if (error.message === "El empleado ya tiene un turno en ese horario") {
      res.status(409).json({ message: error.message });
      return;
    }

    res.status(500).json({ error: "Error al crear el turno" });
  }
};

// Obtener todos los turnos
export const obtenerTurnosController = async (
  req: Request,
  res: Response
) => {
  try {
    const turnos = await obtenerTurnos();
    res.status(200).json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener turnos" });
  }
};

// Obtener un turno por id
export const obtenerTurnoPorIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const turno = await obtenerTurnoPorId(id);

    if (!turno) {
      res.status(404).json({ message: "Turno no encontrado" });
      return;
    }

    res.status(200).json(turno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el turno" });
  }
};

// Actualizar turno (fecha y/o estado)
export const actualizarTurnoController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { empleado_id, fecha, estado } = req.body;

    const turnoActualizado = await actualizarTurnoCasoDeUso(
      id, empleado_id, fecha, estado
    );

    if (!turnoActualizado) {
      res.status(404).json({ message: "Turno no encontrado" });
      return;
    }

    res.status(200).json(turnoActualizado);
  } catch (error: any) {
    console.error(error);

    if (error.message === "El empleado ya tiene un turno en ese horario") {
      res.status(409).json({ message: error.message });
      return;
    }

    if (error.message === "Estado inválido") {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al actualizar el turno" });
  }
};

// Cancelar turno (baja lógica)
export const cancelarTurnoController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const turnoCancelado = await cancelarTurno(id);

    if (!turnoCancelado) {
      res.status(404).json({ message: "Turno no encontrado" });
      return;
    }

    res.status(200).json({ message: "Turno cancelado correctamente", turno: turnoCancelado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cancelar el turno" });
  }
};