import { Router } from "express";

import {
    crearEmpleadoController,
    obtenerEmpleadosController,
    obtenerEmpleadoPorIdController,
    actualizarEmpleadoController,
    eliminarEmpleadoController
} from "../controllers/empleado.controller";

const router = Router();

router.post("/", crearEmpleadoController);
router.get("/", obtenerEmpleadosController);
router.get("/:id", obtenerEmpleadoPorIdController);
router.put("/:id", actualizarEmpleadoController);
router.delete("/:id", eliminarEmpleadoController);

export default router;