// Archivo NUEVO — issue #20
import { Router } from "express";
import {
  registrarUsuarioController,
  verificarCuentaController,
  reenviarCodigoController,
  iniciarRegistroGoogleController,
  registrarUsuarioGoogleController
} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/registro", registrarUsuarioController);
router.post("/verificar-cuenta", verificarCuentaController);
router.post("/reenviar-codigo", reenviarCodigoController);
router.post("/registro/google/verificar", iniciarRegistroGoogleController);
router.post("/registro/google", registrarUsuarioGoogleController);

export default router;
