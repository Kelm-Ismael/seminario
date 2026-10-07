// ======================================================================
// PEGAR AL FINAL de js/core/config.js (no reemplaza lo que ya tenés)
// ======================================================================

// Dirección del backend. Si abrís el front desde el mismo servidor
// (http://localhost:3000/pages/registro.html) podés dejarlo así.
// Cuando lo subas a Railway, cambialo por la URL de producción.
const API_BASE = "http://localhost:3000";
// const API_BASE = "https://seminario-production-627f.up.railway.app";

// Rutas de usuario (backend/src/interfaces/routes/usuario.routes.ts)
export const API_REGISTRO = `${API_BASE}/registro`;
export const API_VERIFICAR_CUENTA = `${API_BASE}/verificar-cuenta`;
export const API_REENVIAR_CODIGO = `${API_BASE}/reenviar-codigo`;
export const API_REGISTRO_GOOGLE_VERIFICAR = `${API_BASE}/registro/google/verificar`;
export const API_REGISTRO_GOOGLE = `${API_BASE}/registro/google`;

// ID de cliente OAuth de Google (Google Cloud Console → APIs y servicios →
// Credenciales). Tiene que ser EL MISMO que GOOGLE_CLIENT_ID del .env del backend.
export const GOOGLE_CLIENT_ID = "PEGAR-AQUI.apps.googleusercontent.com";
