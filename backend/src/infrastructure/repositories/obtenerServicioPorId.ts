import { pool } from "../../config/db";

// Función async para obtener un servicio por su id
export const obtenerServicioPorId = async (id: number) => {

  const result = await pool.query(

    `
    SELECT * FROM servicios
    WHERE id_servicios = $1
    `,

    [id]
  );

  return result.rows[0];
};