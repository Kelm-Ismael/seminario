

// export const API_TURNOS = "https://seminario-production-627f.up.railway.app/turnos";

// export const API_SERVICIOS = "https://seminario-production-627f.up.railway.app/servicios";
// export const API_EMPLEADOS = "https://seminario-production-627f.up.railway.app/empleados";
// export const API_CLIENTES = "https://seminario-production-627f.up.railway.app/cliente/clientes";


// // Módulo de registro y autenticación (issues #19-22)
// export const API_REGISTRO = "http://localhost:3000/registro";
// export const API_VERIFICAR_CUENTA = "http://localhost:3000/verificar-cuenta";
// export const API_REENVIAR_CODIGO = "http://localhost:3000/reenviar-codigo";

// // Registro con Google SSO (por ahora solo cuentas nuevas — ver
// // claude/estado-backend-db.md para el alcance acordado)
// export const API_REGISTRO_GOOGLE_VERIFICAR = "http://localhost:3000/registro/google/verificar";
// export const API_REGISTRO_GOOGLE = "http://localhost:3000/registro/google";

// // Client ID de OAuth 2.0 (Google Cloud Console > APIs & Services >
// // Credentials). Tiene que ser el MISMO valor que GOOGLE_CLIENT_ID en
// // Backend/.env.
// export const GOOGLE_CLIENT_ID = "596833095283-71h4q6ua9to2otsi7lv73bgv6arseq8g.apps.googleusercontent.com";


//-------------------------------------------------------
//esto para localhost nomas
// export const API_TURNOS = "http://localhost:3000/turnos";
// export const API_SERVICIOS = "http://localhost:3000/servicios";
// export const API_EMPLEADOS = "http://localhost:3000/empleados";
// export const API_CLIENTES = "http://localhost:3000/cliente/clientes";
//--------------------------------------------------------

// ============================================================================
//  URL del backend
//  · Si la página se abre en tu PC (localhost) → usa el backend local.
//  · Si se abre desde Vercel → usa el backend publicado en Render.
//  Lo único que hay que completar es RENDER_URL.
// ============================================================================
const RENDER_URL = "https://seminario-yito.onrender.com";   // ← pegá acá la URL de tu servicio en Render (sin "/" al final)
const LOCAL_URL  = "http://localhost:3000";

const esLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
export const API_BASE = esLocal ? LOCAL_URL : RENDER_URL;

// Turnos, servicios, empleados y clientes
export const API_TURNOS    = `${API_BASE}/turnos`;
export const API_SERVICIOS = `${API_BASE}/servicios`;
export const API_EMPLEADOS = `${API_BASE}/empleados`;
export const API_CLIENTES  = `${API_BASE}/cliente/clientes`;

// Registro y verificación de cuenta
export const API_REGISTRO         = `${API_BASE}/registro`;
export const API_VERIFICAR_CUENTA = `${API_BASE}/verificar-cuenta`;
export const API_REENVIAR_CODIGO  = `${API_BASE}/reenviar-codigo`;

// Registro con Google
export const API_REGISTRO_GOOGLE_VERIFICAR = `${API_BASE}/registro/google/verificar`;
export const API_REGISTRO_GOOGLE           = `${API_BASE}/registro/google`;

// Client ID de OAuth 2.0 (Google Cloud Console). Debe ser el mismo valor
// que la variable GOOGLE_CLIENT_ID del backend.
export const GOOGLE_CLIENT_ID = "596833095283-71h4q6ua9to2otsi7lv73bgv6arseq8g.apps.googleusercontent.com";

