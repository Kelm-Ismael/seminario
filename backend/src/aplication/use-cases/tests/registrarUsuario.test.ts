/// <reference types="jest" />
// Archivo NUEVO — issue #22 (Test Unitario BE)
// Tests unitarios de registrarUsuarioCasoDeUso (Escenario 2: Registrarse).
// Todas las dependencias externas (DB, hash de password, generación de
// token y envío de email) se mockean: un test unitario no debe tocar
// la base de datos real ni mandar un correo real.

import { registrarUsuarioCasoDeUso } from "../registrarUsuario.js";

import { crearUsuario, buscarUsuarioPorEmail } from "../../../infrastructure/repositories/usuario.repository.js";
import { crearClienteDesdeRegistro } from "../../../infrastructure/repositories/cliente.repository.js";
import { crearToken } from "../../../infrastructure/repositories/tokenVerificacion.repository.js";
import { registrarEvento } from "../../../infrastructure/repositories/logAuditoria.repository.js";
import { hashPassword } from "../../../infrastructure/security/password.util.js";
import { generarTokenAleatorio, calcularExpiracion24h } from "../../../infrastructure/security/token.util.js";
import { enviarCorreoVerificacion } from "../../../infrastructure/email/correoVerificacion.service.js";

jest.mock("../../../infrastructure/repositories/usuario.repository.js");
jest.mock("../../../infrastructure/repositories/cliente.repository.js");
jest.mock("../../../infrastructure/repositories/tokenVerificacion.repository.js");
jest.mock("../../../infrastructure/repositories/logAuditoria.repository.js");
jest.mock("../../../infrastructure/security/password.util.js");
jest.mock("../../../infrastructure/security/token.util.js");
jest.mock("../../../infrastructure/email/correoVerificacion.service.js");

// Casteamos los mocks para poder usar .mockResolvedValue / .mockReturnValue
// con el tipado de Jest.
const mockBuscarUsuarioPorEmail = buscarUsuarioPorEmail as jest.Mock;
const mockCrearUsuario = crearUsuario as jest.Mock;
const mockCrearClienteDesdeRegistro = crearClienteDesdeRegistro as jest.Mock;
const mockCrearToken = crearToken as jest.Mock;
const mockRegistrarEvento = registrarEvento as jest.Mock;
const mockHashPassword = hashPassword as jest.Mock;
const mockGenerarTokenAleatorio = generarTokenAleatorio as jest.Mock;
const mockCalcularExpiracion24h = calcularExpiracion24h as jest.Mock;
const mockEnviarCorreoVerificacion = enviarCorreoVerificacion as jest.Mock;

// Fecha relativa a "hoy" para que el test no dependa de en qué fecha se corra:
// una persona de 30 años siempre es válida (entre 18 y 70).
const fechaHaceAnios = (anios: number): string => {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - anios);
  return fecha.toISOString().slice(0, 10);
};


const datosValidos = {
  email: "cliente@example.com",
  password: "Abcdef12",
  nombre: "Ana",
  apellido: "Gómez",
  fecha_nacimiento: fechaHaceAnios(30),
  celular: "+543794000000"
};

describe("registrarUsuarioCasoDeUso", () => {

  // ── Validaciones de campos obligatorios ──────────────────────────────
  test("lanza error si falta el email", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, email: "" })
    ).rejects.toThrow("El email es obligatorio");
  });

  test("lanza error si falta la password", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, password: "" })
    ).rejects.toThrow("La contraseña es obligatoria");
  });

  // ── Formato de contraseña (mín. 8 caracteres, mayúscula, minúscula y número) ──
  test("lanza error si la password tiene menos de 8 caracteres", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, password: "Abc123" })
    ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número");
  });

  test("lanza error si la password no tiene mayúscula", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, password: "abcdefg1" })
    ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número");
  });

  test("lanza error si la password no tiene minúscula", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, password: "ABCDEFG1" })
    ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número");
  });

  test("lanza error si la password no tiene número", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, password: "Abcdefgh" })
    ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número");
  });

  test("lanza error si falta el nombre", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, nombre: "   " })
    ).rejects.toThrow("El nombre es obligatorio");
  });

  test("lanza error si falta el apellido", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, apellido: "" })
    ).rejects.toThrow("El apellido es obligatorio");
  });

  test("lanza error si falta la fecha de nacimiento", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, fecha_nacimiento: "" })
    ).rejects.toThrow("La fecha de nacimiento es obligatoria");
  });

  test("lanza error si falta el celular", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, celular: "" })
    ).rejects.toThrow("El celular es obligatorio");
  });



  // ── Formato de celular (+54 + código de área + número) ───────────────
  test("lanza error si el celular no tiene el prefijo +54", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, celular: "3794000000" })
    ).rejects.toThrow("El celular debe tener el formato +54 seguido del código de área y número (solo dígitos, sin espacios ni guiones)");
  });

  test("lanza error si el celular tiene letras", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, celular: "+54379abc4000" })
    ).rejects.toThrow("El celular debe tener el formato +54 seguido del código de área y número (solo dígitos, sin espacios ni guiones)");
  });

  test("lanza error si el celular es demasiado corto para tener código de área + número", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, celular: "+5412345" })
    ).rejects.toThrow("El celular debe tener el formato +54 seguido del código de área y número (solo dígitos, sin espacios ni guiones)");
  });

  // ── Validez de la fecha de nacimiento (formato + edad 18-70) ─────────
  test("lanza error si la fecha de nacimiento no es una fecha real", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, fecha_nacimiento: "no-es-una-fecha" })
    ).rejects.toThrow("La fecha de nacimiento no es válida");
  });

  test("lanza error si la fecha de nacimiento es futura", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, fecha_nacimiento: fechaHaceAnios(-5) })
    ).rejects.toThrow("La fecha de nacimiento no puede ser una fecha futura");
  });

  test("lanza error si es menor de 18 años", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, fecha_nacimiento: fechaHaceAnios(10) })
    ).rejects.toThrow("Tenés que ser mayor de 18 años para registrarte");
  });

  test("lanza error si supera los 70 años", async () => {
    await expect(
      registrarUsuarioCasoDeUso({ ...datosValidos, fecha_nacimiento: fechaHaceAnios(80) })
    ).rejects.toThrow("La edad máxima para registrarte es 70 años");
  });

  // ── Email duplicado ───────────────────────────────────────────────────
  test("lanza error si ya existe una cuenta con ese email", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue({ id_usuario: 1, email: datosValidos.email });

    await expect(
      registrarUsuarioCasoDeUso(datosValidos)
    ).rejects.toThrow("Ya existe una cuenta registrada con ese email");

    expect(mockCrearUsuario).not.toHaveBeenCalled();
  });

  // ── Fallos al insertar en DB ──────────────────────────────────────────
  test("lanza error si crearUsuario no devuelve nada", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(undefined);
    mockHashPassword.mockResolvedValue("hash-falso");
    mockCrearUsuario.mockResolvedValue(undefined);

    await expect(
      registrarUsuarioCasoDeUso(datosValidos)
    ).rejects.toThrow("No se pudo crear el usuario");
  });

  test("lanza error si crearClienteDesdeRegistro no devuelve nada", async () => {
    mockBuscarUsuarioPorEmail.mockResolvedValue(undefined);
    mockHashPassword.mockResolvedValue("hash-falso");
    mockCrearUsuario.mockResolvedValue({ id_usuario: 1, email: datosValidos.email, estado_cuenta: "pendiente" });
    mockCrearClienteDesdeRegistro.mockResolvedValue(undefined);

    await expect(
      registrarUsuarioCasoDeUso(datosValidos)
    ).rejects.toThrow("No se pudo crear el perfil de cliente");
  });

  // ── Camino feliz ──────────────────────────────────────────────────────
  test("registra el usuario, crea el cliente, genera el token, manda el mail y registra el evento", async () => {
    const usuarioCreado = { id_usuario: 1, email: datosValidos.email, estado_cuenta: "pendiente" };
    const clienteCreado = { id_cliente: 1, nombre: "Ana", apellido: "Gómez" };
    const tokenCreado = { id_token: 1, usuario_id: 1, token_validacion: "482913" };
    const expiracion = new Date("2026-09-16T00:00:00.000Z");

    mockBuscarUsuarioPorEmail.mockResolvedValue(undefined);
    mockHashPassword.mockResolvedValue("hash-falso");
    mockCrearUsuario.mockResolvedValue(usuarioCreado);
    mockCrearClienteDesdeRegistro.mockResolvedValue(clienteCreado);
    mockGenerarTokenAleatorio.mockReturnValue("482913");
    mockCalcularExpiracion24h.mockReturnValue(expiracion);
    mockCrearToken.mockResolvedValue(tokenCreado);
    mockEnviarCorreoVerificacion.mockResolvedValue(undefined);
    mockRegistrarEvento.mockResolvedValue({ id_log: 1, cliente_id: 1, evento: "registro_usuario" });

    const resultado = await registrarUsuarioCasoDeUso(datosValidos);

    // Se guarda con la password hasheada, no en texto plano
    expect(mockHashPassword).toHaveBeenCalledWith(datosValidos.password);
    expect(mockCrearUsuario).toHaveBeenCalledWith(datosValidos.email, "hash-falso", "pendiente");

    // El perfil de cliente se crea con el id del usuario recién creado
    expect(mockCrearClienteDesdeRegistro).toHaveBeenCalledWith(
      usuarioCreado.id_usuario,
      datosValidos.nombre,
      datosValidos.apellido,
      datosValidos.fecha_nacimiento,
      datosValidos.celular
    );

    // El token de verificación se crea y se manda por mail
    expect(mockCrearToken).toHaveBeenCalledWith(usuarioCreado.id_usuario, "482913", expiracion);
    expect(mockEnviarCorreoVerificacion).toHaveBeenCalledWith(datosValidos.email, "482913");

    // Se registra el evento de auditoría contra el cliente, no contra el usuario
    expect(mockRegistrarEvento).toHaveBeenCalledWith(clienteCreado.id_cliente, "registro_usuario");

    expect(resultado).toEqual({ usuario: usuarioCreado, cliente: clienteCreado, token: tokenCreado });
  });
});
