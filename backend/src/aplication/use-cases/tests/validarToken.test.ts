/// <reference types="jest" />
// Archivo NUEVO — issue #22 (Test Unitario BE)
// Tests unitarios de validarTokenCasoDeUso (Escenario 3: Autenticar cuenta
// con el código de 6 dígitos). Se mockean todos los repositorios: un test
// unitario no debe tocar la base de datos real.

import { validarTokenCasoDeUso } from "../validarToken.js";

import {
  buscarTokenActivoPorUsuario,
  marcarTokenUtilizado,
  marcarTokenExpirado,
  incrementarIntentosFallidos
} from "../../../infrastructure/repositories/tokenVerificacion.repository.js";
import { buscarUsuarioPorEmail, actualizarEstadoCuenta } from "../../../infrastructure/repositories/usuario.repository.js";
import { registrarEvento } from "../../../infrastructure/repositories/logAuditoria.repository.js";

jest.mock("../../../infrastructure/repositories/tokenVerificacion.repository.js");
jest.mock("../../../infrastructure/repositories/usuario.repository.js");
jest.mock("../../../infrastructure/repositories/logAuditoria.repository.js");

const mockBuscarTokenActivoPorUsuario = buscarTokenActivoPorUsuario as jest.Mock;
const mockMarcarTokenUtilizado = marcarTokenUtilizado as jest.Mock;
const mockMarcarTokenExpirado = marcarTokenExpirado as jest.Mock;
const mockIncrementarIntentosFallidos = incrementarIntentosFallidos as jest.Mock;
const mockBuscarUsuarioPorEmail = buscarUsuarioPorEmail as jest.Mock;
const mockActualizarEstadoCuenta = actualizarEstadoCuenta as jest.Mock;
const mockRegistrarEvento = registrarEvento as jest.Mock;

const EMAIL = "cliente@example.com";
const CODIGO_CORRECTO = "482913";

const usuarioBase = { id_usuario: 1, email: EMAIL, estado_cuenta: "pendiente" };

// Token activo, vigente por 24hs (no expirado)
const tokenVigente = {
  id_token: 10,
  usuario_id: 1,
  token_validacion: CODIGO_CORRECTO,
  token_expira: new Date(Date.now() + 24 * 60 * 60 * 1000),
  estado_token: "activo",
  intentos_fallidos: 0
};

describe("validarTokenCasoDeUso", () => {

  test("lanza error si no existe una cuenta con ese email", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(undefined);

    await expect(
      validarTokenCasoDeUso(EMAIL, CODIGO_CORRECTO)
    ).rejects.toThrow("No existe una cuenta registrada con ese email");
  });

  test("lanza error si no hay ningún código pendiente para la cuenta", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioBase);
    mockBuscarTokenActivoPorUsuario.mockResolvedValue(undefined);

    await expect(
      validarTokenCasoDeUso(EMAIL, CODIGO_CORRECTO)
    ).rejects.toThrow("No hay ningún código pendiente para esta cuenta");
  });

  test("lanza error y marca el token expirado si ya venció", async () => {
    const tokenVencido = { ...tokenVigente, token_expira: new Date(Date.now() - 1000) };
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioBase);
    mockBuscarTokenActivoPorUsuario.mockResolvedValue(tokenVencido);

    await expect(
      validarTokenCasoDeUso(EMAIL, CODIGO_CORRECTO)
    ).rejects.toThrow("El código expiró, tenés que pedir uno nuevo");

    expect(mockMarcarTokenExpirado).toHaveBeenCalledWith(tokenVencido.id_token);
  });

  test("lanza error de código incorrecto y suma un intento fallido, sin expirar el token si no llegó al máximo", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioBase);
    mockBuscarTokenActivoPorUsuario.mockResolvedValue(tokenVigente);
    mockIncrementarIntentosFallidos.mockResolvedValue({ ...tokenVigente, intentos_fallidos: 3 });

    await expect(
      validarTokenCasoDeUso(EMAIL, "000000")
    ).rejects.toThrow("El código ingresado es incorrecto");

    expect(mockIncrementarIntentosFallidos).toHaveBeenCalledWith(tokenVigente.id_token);
    expect(mockMarcarTokenExpirado).not.toHaveBeenCalled();
  });

  test("al superar el máximo de intentos fallidos, expira el token y avisa que hay que pedir uno nuevo", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioBase);
    mockBuscarTokenActivoPorUsuario.mockResolvedValue(tokenVigente);
    mockIncrementarIntentosFallidos.mockResolvedValue({ ...tokenVigente, intentos_fallidos: 5 });

    await expect(
      validarTokenCasoDeUso(EMAIL, "000000")
    ).rejects.toThrow("Superaste el máximo de intentos, tenés que pedir un código nuevo");

    expect(mockMarcarTokenExpirado).toHaveBeenCalledWith(tokenVigente.id_token);
  });

  test("lanza error si falla al actualizar el estado de la cuenta", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioBase);
    mockBuscarTokenActivoPorUsuario.mockResolvedValue(tokenVigente);
    mockMarcarTokenUtilizado.mockResolvedValue({ ...tokenVigente, estado_token: "utilizado" });
    mockActualizarEstadoCuenta.mockResolvedValue(undefined);

    await expect(
      validarTokenCasoDeUso(EMAIL, CODIGO_CORRECTO)
    ).rejects.toThrow("Error al actualizar el estado de la cuenta");
  });

  // ── Camino feliz ──────────────────────────────────────────────────────
  test("con el código correcto, marca el token utilizado, activa la cuenta y registra el evento", async () => {
    const usuarioActivado = { ...usuarioBase, estado_cuenta: "activo" };

    mockBuscarUsuarioPorEmail.mockResolvedValue(usuarioBase);
    mockBuscarTokenActivoPorUsuario.mockResolvedValue(tokenVigente);
    mockMarcarTokenUtilizado.mockResolvedValue({ ...tokenVigente, estado_token: "utilizado" });
    mockActualizarEstadoCuenta.mockResolvedValue(usuarioActivado);
    mockRegistrarEvento.mockResolvedValue({ id_log: 1, cliente_id: 1, evento: "cuenta_verificada" });

    const resultado = await validarTokenCasoDeUso(EMAIL, CODIGO_CORRECTO);

    expect(mockMarcarTokenUtilizado).toHaveBeenCalledWith(tokenVigente.id_token);
    expect(mockActualizarEstadoCuenta).toHaveBeenCalledWith(usuarioBase.id_usuario, "activo");
    expect(mockRegistrarEvento).toHaveBeenCalledWith(usuarioBase.id_usuario, "cuenta_verificada");
    expect(resultado).toEqual(usuarioActivado);
  });
});