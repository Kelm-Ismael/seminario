import { pool } from "../../config/db";

// Función async para obtener un empleado por su id
export const obtenerEmpleadoPorId = async (id: number) => {

  const result = await pool.query(

    `
    SELECT * FROM empleados
    WHERE id_empleados = $1
    `,

    [id]
  );

  return result.rows[0];
};