import { Router } from "express";
import { crearTurnoControlador } from "../controllers/turno.controller";


const router = Router();

router.post("/", crearTurnoControlador);

export default router;


