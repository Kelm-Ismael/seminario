import { Router } from "express"; // importa Router de Express

import { crearClienteController,obtenerClientesController } from "../controllers/cliente.controller"; // importamos el controller



const router = Router(); //creamos instancia del router

//Endpoint POST para crear cliente
// cuando llegue POST / cliente
//Se ejecuta crearClienteController

router.post("/clientes", crearClienteController);

// Endpoint GET para obtener clientes
router.get(
  "/clientes",
  obtenerClientesController
);

//exportamos router

export default router;


