// Archivo NUEVO — issue #20 (modificado en #21 para el envío real del mail)
// Orquesta el Escenario 2 completo por canal EMAIL (WhatsApp y Google SSO
// quedan fuera de este sprint: no están entre los issues #19-22).
import { crearUsuario, buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { crearClienteDesdeRegistro } from "../../infrastructure/repositories/cliente.repository.js";
import { crearToken } from "../../infrastructure/repositories/tokenVerificacion.repository.js";
import { registrarEvento } from "../../infrastructure/repositories/logAuditoria.repository.js";
import { hashPassword } from "../../infrastructure/security/password.util.js";
import { generarTokenAleatorio, calcularExpiracion24h } from "../../infrastructure/security/token.util.js";
// NUEVO (issue #21) — envío real del mail de verificación
import { enviarCorreoVerificacion } from "../../infrastructure/email/correoVerificacion.service.js";
import { formatoCelularValido, fechaNacimientoValida, formatoPasswordValido } from "../../infrastructure/validation/registroValidaciones.util.js";

interface DatosRegistro {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  celular: string;
}

export const registrarUsuarioCasoDeUso = async (datos: DatosRegistro) => {
  const { email, password, nombre, apellido, fecha_nacimiento, celular } = datos;

  // Validaciones simples
  if (!email || !email.trim()) {
    throw new Error("El email es obligatorio");
  }
  if (!password) {
    throw new Error("La contraseña es obligatoria");
  }
  // Regla de negocio #2 (CU-01 Registrarse): mínimo 8 caracteres, con al
  // menos una mayúscula, una minúscula y un número.
  if (!formatoPasswordValido(password)) {
    throw new Error("La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número");
  }
  if (!nombre || !nombre.trim()) {
    throw new Error("El nombre es obligatorio");
  }
  if (!apellido || !apellido.trim()) {
    throw new Error("El apellido es obligatorio");
  }
  if (!fecha_nacimiento || !fecha_nacimiento.trim()) {
    throw new Error("La fecha de nacimiento es obligatoria");
  }
  const validacionFecha = fechaNacimientoValida(fecha_nacimiento);
  if (!validacionFecha.valida) {
    throw new Error(validacionFecha.motivo);
  }
  if (!celular || !celular.trim()) {
    throw new Error("El celular es obligatorio");
  }
   if (!formatoCelularValido(celular)) {
    throw new Error("El celular debe tener el formato +54 seguido del código de área y número (solo dígitos, sin espacios ni guiones)");
  }

  const usuarioExistente = await buscarUsuarioPorEmail(email);
  if (usuarioExistente) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }

  const passwordHash = await hashPassword(password);

  // Canal email: la cuenta nace "pendiente" hasta que se verifique el token
  const usuario = await crearUsuario(email, passwordHash, "pendiente");
  if (!usuario) {
    throw new Error("No se pudo crear el usuario");
  }

  const cliente = await crearClienteDesdeRegistro(
    usuario.id_usuario,
    nombre,
    apellido,
    fecha_nacimiento,
    celular
  );
  if (!cliente) {
    throw new Error("No se pudo crear el perfil de cliente");
  }

  const tokenValidacion = generarTokenAleatorio();
  const tokenExpira = calcularExpiracion24h();
  const token = await crearToken(usuario.id_usuario, tokenValidacion, tokenExpira);

  // issue #21: envío real del email con el link de verificación
  await enviarCorreoVerificacion(email, tokenValidacion);

  await registrarEvento(cliente.id_cliente, "registro_usuario");

  return { usuario, cliente, token };
};
