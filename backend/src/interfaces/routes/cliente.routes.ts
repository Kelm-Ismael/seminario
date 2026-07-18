import { Router } from "express"; // importa Router de Express

import { crearClienteController,obtenerClientesController } from "../controllers/cliente.controller"; // importamos el controller


const router = Router();

router.post("/clientes", crearClienteController);
router.get("/clientes", obtenerClientesController);

export default router;
