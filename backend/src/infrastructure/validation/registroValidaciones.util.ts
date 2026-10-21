// Archivo NUEVO — validaciones de formato para el registro (Escenario 2).
// Antes solo se chequeaba que celular y fecha_nacimiento no vinieran vacíos;
// ahora también se valida que tengan un formato/valor razonable.

// CU-01, RN7: el celular se ingresa en formato internacional, aceptando
// cualquier país: "+" seguido del código de país y el número, entre 8 y 15
// dígitos (sin espacios ni guiones).
const REGEX_CELULAR = /^\+\d{8,15}$/;

export const MENSAJE_CELULAR_INVALIDO =
  "El celular debe comenzar con + seguido del código de país y el número (entre 8 y 15 dígitos, sin espacios ni guiones)";

export const formatoCelularValido = (celular: string): boolean => {
  return REGEX_CELULAR.test(celular.trim());
};

// CU-01, RN8: edad mínima 18 años, sin límite máximo.
export const EDAD_MINIMA = 18;

const calcularEdad = (fechaNacimiento: Date): number => {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

  const todaviaNoCumplioEsteAnio =
    hoy.getMonth() < fechaNacimiento.getMonth() ||
    (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate());

  if (todaviaNoCumplioEsteAnio) {
    edad--;
  }

  return edad;
};

interface ResultadoValidacionFecha {
  valida: boolean;
  motivo?: string;
}

export const fechaNacimientoValida = (fechaNacimientoStr: string): ResultadoValidacionFecha => {
  const fecha = new Date(fechaNacimientoStr);

  if (Number.isNaN(fecha.getTime())) {
    return { valida: false, motivo: "La fecha de nacimiento no es válida" };
  }

  if (fecha.getTime() > Date.now()) {
    return { valida: false, motivo: "La fecha de nacimiento no puede ser una fecha futura" };
  }

  const edad = calcularEdad(fecha);

  if (edad < EDAD_MINIMA) {
    return { valida: false, motivo: "Tenés que ser mayor de 18 años para registrarte" };
  }

  return { valida: true };
};

// NUEVO — Regla de negocio #2 del caso de uso CU-01 "Registrarse": la
// contraseña debe tener una longitud mínima de 8 caracteres e incluir al
// menos una letra mayúscula, una minúscula y un número.
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

export const formatoPasswordValido = (password: string): boolean => {
  return REGEX_PASSWORD.test(password);
};

// CU-01, RN9: aceptación obligatoria de Términos y Política de Privacidad.
export const MENSAJE_TERMINOS_NO_ACEPTADOS =
  "Tenés que aceptar los Términos y Condiciones y la Política de Privacidad";

// Mensajes de validación que el controlador devuelve como 400 (error del
// usuario) en lugar de 500 (error del servidor).
export const MENSAJES_ERROR_VALIDACION: string[] = [
  "El email es obligatorio",
  "La contraseña es obligatoria",
  "La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número",
  "El nombre es obligatorio",
  "El apellido es obligatorio",
  "La fecha de nacimiento es obligatoria",
  "La fecha de nacimiento no es válida",
  "La fecha de nacimiento no puede ser una fecha futura",
  "Tenés que ser mayor de 18 años para registrarte",
  "El celular es obligatorio",
  MENSAJE_CELULAR_INVALIDO,
  MENSAJE_TERMINOS_NO_ACEPTADOS,
  "Falta la información de Google",
];
