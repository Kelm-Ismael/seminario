// Archivo NUEVO — issue #20
// Actualizado: el código pasó de 64 caracteres hex a 6 dígitos numéricos
// (pantalla "Confirmá tu cuenta" del mockup, ingreso manual por el usuario).
import { randomInt } from "crypto";

// Genera un código de 6 dígitos (000000-999999), con ceros a la izquierda
// si hace falta. Sigue entrando en tokens_verificacion.token_validacion VARCHAR(64).
export const generarTokenAleatorio = (): string => {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
};

// Fecha de expiración: 24 horas desde ahora (Escenario 3)
export const calcularExpiracion24h = (): Date => {
  const ahora = new Date();
  return new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
};