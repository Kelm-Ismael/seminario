import { pool } from "../../config/db";

// Función async para actualizar un empleado
export const actualizarEmpleado = async (
  id: number,
  nombre: string,
  telefono: string,
  email: string
) => {

  const result = await pool.query(

    `
    UPDATE empleados
    SET nombre = $1,
        telefono = $2,
        email = $3
    WHERE id_empleados = $4
    RETURNING *
    `,

    [nombre, telefono, email, id]
  );

  return result.rows[0];
};