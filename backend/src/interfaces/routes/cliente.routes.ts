import { Router } from "express"; // importa Router de Express

import { crearClienteController } from "../controllers/cliente.controller"; // importamos el controller

const router = Router(); //creamos instancia del router

//Endpoint POST para crear cliente
// cuando llegue POST / cliente
//Se ejecuta crearClienteController

router.post("/clientes", crearClienteController);

//exportamos router

export default router;


