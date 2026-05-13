import { Router } from "express";
import { crearTurnoControlador, obtenerTurnosController } from "../controllers/turno.controller";


const router = Router();

router.post("/", crearTurnoControlador); //Endpoint POST para crear turno
router.get("/", obtenerTurnosController); // Endpoint GET para obtener clientes

export default router;


