/// <reference types="jest" />
// Archivo NUEVO — issue #22 (Test Unitario BE)
// Tests unitarios de reenviarCodigoCasoDeUso (botón "Reenviar" de la
// pantalla "Confirmá tu cuenta"). Se mockean todos los repositorios y el
// envío de mail: un test unitario no debe tocar la DB real ni mandar
// un correo real.

import { reenviarCodigoCasoDeUso } from "../reenviarCodigo.js";

import {
  buscarUltimoTokenPorUsuario,
  marcarTokenExpirado,
  crearToken
} from "../../../infrastructure/repositories/tokenVerificacion.repository.js";
import { buscarUsuarioPorEmail } from "../../../infrastructure/repositories/usuario.repository.js";
import { generarTokenAleatorio, calcularExpiracion24h } from "../../../infrastructure/security/token.util.js";
import { enviarCorreoVerificacion } from "../../../infrastructure/email/correoVerificacion.service.js";

jest.mock("../../../infrastructure/repositories/tokenVerificacion.repository.js");
jest.mock("../../../infrastructure/repositories/usuario.repository.js");
jest.mock("../../../infrastructure/security/token.util.js");
jest.mock("../../../infrastructure/email/correoVerificacion.service.js");

const mockBuscarUltimoTokenPorUsuario = buscarUltimoTokenPorUsuario as jest.Mock;
const mockMarcarTokenExpirado = marcarTokenExpirado as jest.Mock;
const mockCrearToken = crearToken as jest.Mock;
const mockBuscarUsuarioPorEmail = buscarUsuarioPorEmail as jest.Mock;
const mockGenerarTokenAleatorio = generarTokenAleatorio as jest.Mock;
const mockCalcularExpiracion24h = calcularExpiracion24h as jest.Mock;
const mockEnviarCorreoVerificacion = enviarCorreoVerificacion as jest.Mock;

const EMAIL = "cliente@example.com";
const usuarioPendiente = { id_usuario: 1, email: EMAIL, estado_cuenta: "pendiente" };

describe("reenviarCodigoCasoDeUso", () => {

  test("lanza error si no existe una cuenta con ese email", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(undefined);

    await expect(reenviarCodigoCasoDeUso(EMAIL)).rejects.toThrow(
      "No existe una cuenta registrada con ese email"
    );
  });

  test("lanza error si la cuenta ya está verificada", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue({ ...usuarioPendiente, estado_cuenta: "activo" });

    await expect(reenviarCodigoCasoDeUso(EMAIL)).rejects.toThrow(
      "Esta cuenta ya está verificada"
    );

    expect(mockBuscarUltimoTokenPorUsuario).not.toHaveBeenCalled();
  });

  test("lanza error de cooldown si todavía no pasaron los 60 segundos desde el último envío", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioPendiente);
    mockBuscarUltimoTokenPorUsuario.mockResolvedValue({
      id_token: 5,
      usuario_id: 1,
      estado_token: "activo",
      creado_en: new Date(Date.now() - 10_000) // hace 10 segundos
    });

    await expect(reenviarCodigoCasoDeUso(EMAIL)).rejects.toThrow(
      "Esperá 50 segundos antes de pedir un código nuevo"
    );

    expect(mockCrearToken).not.toHaveBeenCalled();
    expect(mockEnviarCorreoVerificacion).not.toHaveBeenCalled();
  });

  test("si ya pasó el cooldown y el último token seguía activo, lo expira antes de crear uno nuevo", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioPendiente);
    mockBuscarUltimoTokenPorUsuario.mockResolvedValue({
      id_token: 5,
      usuario_id: 1,
      estado_token: "activo",
      creado_en: new Date(Date.now() - 61_000) // hace 61 segundos
    });
    mockGenerarTokenAleatorio.mockReturnValue("111111");
    mockCalcularExpiracion24h.mockReturnValue(new Date("2026-09-17T00:00:00.000Z"));
    mockCrearToken.mockResolvedValue({ id_token: 6 });
    mockEnviarCorreoVerificacion.mockResolvedValue(undefined);

    await reenviarCodigoCasoDeUso(EMAIL);

    expect(mockMarcarTokenExpirado).toHaveBeenCalledWith(5);
    expect(mockCrearToken).toHaveBeenCalledWith(1, "111111", new Date("2026-09-17T00:00:00.000Z"));
    expect(mockEnviarCorreoVerificacion).toHaveBeenCalledWith(EMAIL, "111111");
  });

  test("si el último token ya estaba expirado (no activo), no llama a marcarTokenExpirado de nuevo", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioPendiente);
    mockBuscarUltimoTokenPorUsuario.mockResolvedValue({
      id_token: 5,
      usuario_id: 1,
      estado_token: "expirado",
      creado_en: new Date(Date.now() - 61_000)
    });
    mockGenerarTokenAleatorio.mockReturnValue("222222");
    mockCalcularExpiracion24h.mockReturnValue(new Date("2026-09-17T00:00:00.000Z"));
    mockCrearToken.mockResolvedValue({ id_token: 7 });
    mockEnviarCorreoVerificacion.mockResolvedValue(undefined);

    await reenviarCodigoCasoDeUso(EMAIL);

    expect(mockMarcarTokenExpirado).not.toHaveBeenCalled();
    expect(mockCrearToken).toHaveBeenCalledWith(1, "222222", new Date("2026-09-17T00:00:00.000Z"));
  });

  test("si la cuenta nunca tuvo un token (caso límite), igual manda uno nuevo sin chequear cooldown", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioPendiente);
    mockBuscarUltimoTokenPorUsuario.mockResolvedValue(undefined);
    mockGenerarTokenAleatorio.mockReturnValue("333333");
    mockCalcularExpiracion24h.mockReturnValue(new Date("2026-09-17T00:00:00.000Z"));
    mockCrearToken.mockResolvedValue({ id_token: 8 });
    mockEnviarCorreoVerificacion.mockResolvedValue(undefined);

    await reenviarCodigoCasoDeUso(EMAIL);

    expect(mockMarcarTokenExpirado).not.toHaveBeenCalled();
    expect(mockCrearToken).toHaveBeenCalledWith(1, "333333", new Date("2026-09-17T00:00:00.000Z"));
    expect(mockEnviarCorreoVerificacion).toHaveBeenCalledWith(EMAIL, "333333");
  });
});