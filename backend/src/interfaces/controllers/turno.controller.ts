import { Request, Response } from "express";
import { CrearTurnoCasoDeUso } from "../../aplication/use-cases/crearTurno";
import { actualizarTurnoCasoDeUso } from "../../aplication/use-cases/actualizarTurno";

import { obtenerTurnos } from "../../infrastructure/repositories/obtenerTurnos";
import {
  obtenerTurnoPorId,
  cancelarTurno
} from "../../infrastructure/repositories/turno.repository";

import { enviarWhatsApp } from "../../infrastructure/whatsapp/whatsapp.service";
// Crear turno


// Crear turno
export const crearTurnoControlador = async (req: Request, res: Response) => {
  try {
    const turno = await CrearTurnoCasoDeUso(req.body);

    // Respondemos ya al frontend...
    res.status(201).json(turno);

    // ...y mandamos el WhatsApp en segundo plano, sin bloquear la respuesta.
    // Necesitamos los datos completos (nombre, teléfono) del turno recién creado.
    const turnoCompleto = await obtenerTurnoPorId(turno.id_turnos);

    if (turnoCompleto?.cliente_telefono) {

      const fechaLegible = new Date(turnoCompleto.fecha)
        .toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

      enviarWhatsApp(
        turnoCompleto.cliente_telefono,
        `Hola ${turnoCompleto.cliente_nombre}! Tu turno para ${turnoCompleto.servicio_nombre} quedó confirmado para el ${fechaLegible} con ${turnoCompleto.empleado_nombre}. Te esperamos 💈`
      );

    }

  } catch (error: any) {
    console.error(error);

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
// Actualizar turno (fecha y/o estado y/o empleado)
export const actualizarTurnoController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { empleado_id, fecha, estado } = req.body;

    // Traemos el turno actual para permitir updates parciales
    // (si solo mandan "estado", no queremos pisar empleado_id/fecha con NULL)
    const turnoActual = await obtenerTurnoPorId(id);

    if (!turnoActual) {
      res.status(404).json({ message: "Turno no encontrado" });
      return;
    }

    const empleadoFinal = empleado_id ?? turnoActual.empleado_id;
    const fechaFinal = fecha ?? turnoActual.fecha;
    const estadoFinal = estado ?? turnoActual.estado;

    const turnoActualizado = await actualizarTurnoCasoDeUso(
      id, empleadoFinal, fechaFinal, estadoFinal
    );

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