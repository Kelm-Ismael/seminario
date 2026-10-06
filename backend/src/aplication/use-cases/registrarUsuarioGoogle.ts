// Archivo NUEVO — Escenario 2 (Registrarse) por canal Google SSO, paso 2.
//
// Se llama después de que el usuario completó celular y fecha de
// nacimiento en la pantalla intermedia. La cuenta queda "activa" directo:
// Google ya verificó el email, así que no hace falta el código de 6
// dígitos que usa el registro por email.
import { crearUsuario, buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { crearClienteDesdeRegistroGoogle, buscarClientePorGoogleId } from "../../infrastructure/repositories/cliente.repository.js";
import { registrarEvento } from "../../infrastructure/repositories/logAuditoria.repository.js";
import { formatoCelularValido, fechaNacimientoValida } from "../../infrastructure/validation/registroValidaciones.util.js";

interface DatosRegistroGoogle {
  googleId: string;
  email: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  celular: string;
}

export const registrarUsuarioGoogleCasoDeUso = async (datos: DatosRegistroGoogle) => {
  const { googleId, email, nombre, apellido, fecha_nacimiento, celular } = datos;

  if (!googleId || !email) {
    throw new Error("Falta la información de Google");
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

  // Re-chequeo: puede haber pasado tiempo entre el paso 1 (verificar token)
  // y que la persona complete este formulario.
  const usuarioExistente = await buscarUsuarioPorEmail(email);
  if (usuarioExistente) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }
  const clienteExistente = await buscarClientePorGoogleId(googleId);
  if (clienteExistente) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }

  // Sin password: el acceso a esta cuenta es siempre vía Google.
  const usuario = await crearUsuario(email, null, "activo");
  if (!usuario) {
    throw new Error("No se pudo crear el usuario");
  }

  const cliente = await crearClienteDesdeRegistroGoogle(
    usuario.id_usuario,
    nombre,
    apellido,
    fecha_nacimiento,
    celular,
    googleId
  );
  if (!cliente) {
    throw new Error("No se pudo crear el perfil de cliente");
  }

  await registrarEvento(cliente.id_cliente, "registro_usuario_google");

  return { usuario, cliente };
};
