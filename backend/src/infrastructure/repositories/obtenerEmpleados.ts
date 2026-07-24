import { pool } from "../../config/db";

// Función async para obtener todos los empleados activos
export const obtenerEmpleados = async () => {

  const result = await pool.query(

    `
    SELECT * FROM empleados
    WHERE activo = true
    ORDER BY id_empleados ASC
    `
  );

  return result.rows;
};