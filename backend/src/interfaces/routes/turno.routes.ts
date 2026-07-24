import { Router } from "express";
import {
    crearTurnoControlador,
    obtenerTurnosController,
    obtenerTurnoPorIdController,
    actualizarTurnoController,
    cancelarTurnoController
} from "../controllers/turno.controller";


const router = Router();

router.post("/", crearTurnoControlador);
router.get("/", obtenerTurnosController);
router.get("/:id", obtenerTurnoPorIdController);
router.put("/:id", actualizarTurnoController);
router.delete("/:id", cancelarTurnoController);

export default router;