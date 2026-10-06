// Tipo de la entidad Cliente (tabla `clientes`, tabla-per-type de Usuario).
export interface Cliente {
  id_cliente: number; // == id_usuario
  nombre: string;
  apellido: string;
  fecha_nacimiento: string | null;
  celular: string | null;
  id_google_sso: string | null;
}