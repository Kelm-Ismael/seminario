import { pool } from "../../config/db.js";
import { LogAuditoria } from "../../domain/entities/logAuditoria.entity.js";

// cliente_id == id_usuario, porque clientes es tabla-per-type de usuarios.
export const registrarEvento = async (
  cliente_id: number,
  evento: string
) => {
  const result = await pool.query<LogAuditoria>(
    `
    INSERT INTO log_auditoria (cliente_id, evento)
    VALUES ($1, $2)
    RETURNING *
    `,
    [cliente_id, evento]
  );

  return result.rows[0];
};