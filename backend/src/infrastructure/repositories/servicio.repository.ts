import { pool } from "../../config/db";

// Función async para crear un servicio
export const crearServicio = async (
  nombre: string,
  precio: number,
  duracion: number
) => {

  const result = await pool.query(

    `
    INSERT INTO servicios (nombre, precio, duracion)
    VALUES ($1, $2, $3)
    RETURNING *
    `,

    [nombre, precio, duracion]
  );

  return result.rows[0];
};