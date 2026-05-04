import { Request, Response } from "express";
import { CrearTurnoCasoDeUso } from "../../aplication/use-cases/crearTurno";

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