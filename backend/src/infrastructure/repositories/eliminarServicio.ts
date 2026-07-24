import { pool } from "../../config/db";

// Función async para "eliminar" un servicio (baja lógica, no borrado físico)
// Esto evita romper turnos históricos que referencian este servicio.
export const eliminarServicio = async (id: number) => {

  const result = await pool.query(

    `
    UPDATE servicios
    SET activo = false
    WHERE id_servicios = $1
    RETURNING *
    `,

    [id]
  );

  return result.rows[0];
};