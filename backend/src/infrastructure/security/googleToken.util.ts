// Archivo NUEVO — verifica el idToken que manda Google Identity Services
// desde el frontend. Se usa el endpoint público "tokeninfo" de Google en
// vez de agregar la dependencia google-auth-library: Google hace la
// verificación de firma y expiración por nosotros, y acá solo se chequea
// que el token sea para ESTA aplicación (audience) y que el email esté
// verificado.
import { GOOGLE_CLIENT_ID } from "../../config/env.js";

export interface PerfilGoogle {
  googleId: string;
  email: string;
  nombre: string;
  apellido: string;
}

interface TokenInfoGoogle {
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string; // Google la devuelve como string "true"/"false"
  given_name?: string;
  family_name?: string;
  name?: string;
  error?: string;
  error_description?: string;
}

export const verificarIdTokenGoogle = async (idToken: string): Promise<PerfilGoogle> => {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("Falta el token de Google");
  }

  let datos: TokenInfoGoogle;
  try {
    const respuesta = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    datos = (await respuesta.json()) as TokenInfoGoogle;

    if (!respuesta.ok || datos.error) {
      throw new Error("El token de Google no es válido o expiró");
    }
  } catch {
    throw new Error("El token de Google no es válido o expiró");
  }

  if (!GOOGLE_CLIENT_ID || datos.aud !== GOOGLE_CLIENT_ID) {
    throw new Error("El token de Google no corresponde a esta aplicación");
  }

  if (datos.email_verified !== "true") {
    throw new Error("Tu cuenta de Google no tiene el email verificado");
  }

  if (!datos.sub || !datos.email) {
    throw new Error("El token de Google no es válido o expiró");
  }

  return {
    googleId: datos.sub,
    email: datos.email,
    nombre: datos.given_name || datos.name || "",
    apellido: datos.family_name || ""
  };
};
