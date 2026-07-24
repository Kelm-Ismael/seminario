import { pool } from "../../config/db";

// Baja lógica (igual que servicios), para no romper turnos históricos
// que referencian este empleado.
export const eliminarEmpleado = async (id: number) => {

  const result = await pool.query(

    `
    UPDATE empleados
    SET activo = false
    WHERE id_empleados = $1
    RETURNING *
    `,

    [id]
  );

  return result.rows[0];
};