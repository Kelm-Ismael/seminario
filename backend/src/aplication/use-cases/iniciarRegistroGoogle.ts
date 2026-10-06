// Archivo NUEVO — Escenario 2 (Registrarse) por canal Google SSO, paso 1.
//
// Alcance acordado: esto SOLO cubre cuentas NUEVAS. Si ya existe una cuenta
// con ese email o ese Google ID, se informa al frontend en vez de dejar
// entrar — dejar entrar sin password es, en los hechos, el caso de uso
// "Iniciar sesión", que todavía no se implementa (sigue con el redirect
// placeholder). No mezclar los dos.
import { buscarUsuarioPorEmail } from "../../infrastructure/repositories/usuario.repository.js";
import { buscarClientePorGoogleId } from "../../infrastructure/repositories/cliente.repository.js";
import { verificarIdTokenGoogle, type PerfilGoogle } from "../../infrastructure/security/googleToken.util.js";

const MENSAJE_CUENTA_EXISTENTE = "Ya existe una cuenta registrada con ese email. Iniciá sesión en su lugar.";

export const iniciarRegistroGoogleCasoDeUso = async (idToken: string): Promise<PerfilGoogle> => {
  const perfil = await verificarIdTokenGoogle(idToken);

  const usuarioExistente = await buscarUsuarioPorEmail(perfil.email);
  if (usuarioExistente) {
    throw new Error(MENSAJE_CUENTA_EXISTENTE);
  }

  const clienteExistente = await buscarClientePorGoogleId(perfil.googleId);
  if (clienteExistente) {
    throw new Error(MENSAJE_CUENTA_EXISTENTE);
  }

  // Todavía no se crea nada en la base: faltan celular y fecha de
  // nacimiento, que `clientes` exige (NOT NULL) y Google no provee. El
  // frontend pide esos datos en una pantalla intermedia
  // (completar-registro-google.html) y ahí recién se llama a
  // registrarUsuarioGoogleCasoDeUso con todo junto.
  return perfil;
};
