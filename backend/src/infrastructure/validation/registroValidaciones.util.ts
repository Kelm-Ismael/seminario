// Archivo NUEVO — validaciones de formato para el registro (Escenario 2).
// Antes solo se chequeaba que celular y fecha_nacimiento no vinieran vacíos;
// ahora también se valida que tengan un formato/valor razonable.

// Prefijo internacional de Argentina ("+54") + código de área + número,
// todo junto y solo dígitos después del "+54" (sin espacios ni guiones).
// Ej. "+543794000000" (+54, área 379, número 4000000).
const REGEX_CELULAR = /^\+54\d{8,15}$/;

export const formatoCelularValido = (celular: string): boolean => {
  return REGEX_CELULAR.test(celular.trim());
};

export const EDAD_MINIMA = 18;
export const EDAD_MAXIMA = 70;

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

  if (edad > EDAD_MAXIMA) {
    return { valida: false, motivo: "La edad máxima para registrarte es 70 años" };
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
