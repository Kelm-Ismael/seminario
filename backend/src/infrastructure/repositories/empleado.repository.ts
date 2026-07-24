import { pool } from "../../config/db";

// Función async para crear un empleado
export const crearEmpleado = async (
  nombre: string,
  telefono: string,
  email: string
) => {

  const result = await pool.query(

    `
    INSERT INTO empleados (nombre, telefono, email)
    VALUES ($1, $2, $3)
    RETURNING *
    `,

    [nombre, telefono, email]
  );

  return result.rows[0];
};