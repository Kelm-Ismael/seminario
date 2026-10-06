// Tipo de la entidad Usuario (tabla `usuarios`). Solo forma de los datos, sin lógica.
export interface Usuario {
  id_usuario: number;
  email: string;
  password_hash: string | null;
  fecha_registro: Date;
  estado_cuenta: "pendiente" | "activo" | "bloqueado";
}