import { Request, Response } from "express";
import { CrearTurnoCasoDeUso } from "../../aplication/use-cases/crearTurno";

import { obtenerTurnos } from "../../infrastructure/repositories/obtenerTurnos";

// export const crearTurnoControlador = async (req: Request, res: Response) => {
//     const turno = await CrearTurnoCasoDeUso(req.body);
//     res.json(turno);
// };

export const crearTurnoControlador = async (req: Request, res: Response) => {
  try {
    const turno = await CrearTurnoCasoDeUso(req.body);
    res.json(turno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// Controller para obtener turnos
export const obtenerTurnosController = async (
  req: Request,
  res: Response
) => {

  try {

    // Obtenemos clientes desde DB
    const turnos = await obtenerTurnos();

    // Respondemos con JSON
    res.status(200).json(turnos);

  } catch (error) {

    // Error del servidor
    res.status(500).json({
      message: "Error al obtener tunos"
    });
  }
};