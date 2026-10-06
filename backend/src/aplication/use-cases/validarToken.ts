// Archivo NUEVO — issue #20 (Escenario 3: Autenticar cuenta)
// Actualizado: código de 6 dígitos + email (antes: token largo por link),
// con límite de intentos fallidos por cuenta.
import {
  buscarTokenActivoPorUsuario,
  marcarTokenUtilizado,
  marcarTokenExpirado,
  incrementarIntentosFallidos
} from "../../infrastructure/repositories/tokenVerificacion.repository.js";
import { buscarUsuarioPorEmail, actualizarEstadoCuenta } from "../../infrastructure/repositories/usuario.repository.js";
import { registrarEvento } from "../../infrastructure/repositories/logAuditoria.repository.js";

// Máximo de intentos fallidos antes de invalidar el código (obliga a pedir uno nuevo)
const MAX_INTENTOS_FALLIDOS = 5;

export const validarTokenCasoDeUso = async (email: string, codigo: string) => {
  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario) {
    throw new Error("No existe una cuenta registrada con ese email");
  }

  const token = await buscarTokenActivoPorUsuario(usuario.id_usuario);
  if (!token) {
    throw new Error("No hay ningún código pendiente para esta cuenta");
  }

  const yaExpiro = new Date(token.token_expira).getTime() < Date.now();
  if (yaExpiro) {
    await marcarTokenExpirado(token.id_token);
    throw new Error("El código expiró, tenés que pedir uno nuevo");
  }

  // Código incorrecto: cuenta el intento y, si se pasó del máximo, invalida el token
  if (token.token_validacion !== codigo) {
    const tokenActualizado = await incrementarIntentosFallidos(token.id_token);

    if (tokenActualizado && tokenActualizado.intentos_fallidos >= MAX_INTENTOS_FALLIDOS) {
      await marcarTokenExpirado(token.id_token);
      throw new Error("Superaste el máximo de intentos, tenés que pedir un código nuevo");
    }

    throw new Error("El código ingresado es incorrecto");
  }

  await marcarTokenUtilizado(token.id_token);
  const usuarioActualizado = await actualizarEstadoCuenta(usuario.id_usuario, "activo");
  if (!usuarioActualizado) {
    throw new Error("Error al actualizar el estado de la cuenta");
  }

  // cliente_id == usuario_id (tabla-per-type)
  await registrarEvento(usuario.id_usuario, "cuenta_verificada");

  return usuarioActualizado;
};