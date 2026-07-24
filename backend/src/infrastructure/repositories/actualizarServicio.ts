import { pool } from "../../config/db";

// Función async para actualizar un servicio
export const actualizarServicio = async (
  id: number,
  nombre: string,
  precio: number,
  duracion: number
) => {

  const result = await pool.query(

    `
    UPDATE servicios
    SET nombre = $1,
        precio = $2,
        duracion = $3
    WHERE id_servicios = $4
    RETURNING *
    `,

    [nombre, precio, duracion, id]
  );

  return result.rows[0];
};