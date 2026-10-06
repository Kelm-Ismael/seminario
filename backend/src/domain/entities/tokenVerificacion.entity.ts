export interface TokenVerificacion {
  id_token: number;
  usuario_id: number;
  token_validacion: string;
  token_expira: Date;
  estado_token: "activo" | "expirado" | "utilizado";
}