// Archivo NUEVO (refinamiento de #21) — botón "Reenviar" de la pantalla
// "Confirmá tu cuenta": pide un código nuevo cuando el anterior venció o no llegó.
import {
  buscarUltimoTokenPorUsuario,
  marcarTokenExpirado,
  crearToken
} from "../../infrastructure/repositories/tokenVerificacion.repository.js";
import { buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { generarTokenAleatorio, calcularExpiracion24h } from "../../infrastructure/security/token.util.js";
import { enviarCorreoVerificacion } from "../../infrastructure/email/correoVerificacion.service.js";

// Tiempo mínimo entre reenvíos (coincide con el "Disponible en 59 seg" del mockup)
const COOLDOWN_REENVIO_SEGUNDOS = 60;

export const reenviarCodigoCasoDeUso = async (email: string): Promise<void> => {
  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario) {
    throw new Error("No existe una cuenta registrada con ese email");
  }

  if (usuario.estado_cuenta === "activo") {
    throw new Error("Esta cuenta ya está verificada");
  }

  const ultimoToken = await buscarUltimoTokenPorUsuario(usuario.id_usuario);

  if (ultimoToken) {
    const segundosDesdeUltimoEnvio =
      (Date.now() - new Date(ultimoToken.creado_en).getTime()) / 1000;

    if (segundosDesdeUltimoEnvio < COOLDOWN_REENVIO_SEGUNDOS) {
      const restante = Math.ceil(COOLDOWN_REENVIO_SEGUNDOS - segundosDesdeUltimoEnvio);
      throw new Error(`Esperá ${restante} segundos antes de pedir un código nuevo`);
    }

    // Invalida el código anterior si todavía estaba activo (que no queden dos códigos válidos a la vez)
    if (ultimoToken.estado_token === "activo") {
      await marcarTokenExpirado(ultimoToken.id_token);
    }
  }

  const nuevoCodigo = generarTokenAleatorio();
  const nuevaExpiracion = calcularExpiracion24h();
  await crearToken(usuario.id_usuario, nuevoCodigo, nuevaExpiracion);

  await enviarCorreoVerificacion(usuario.email, nuevoCodigo);
};