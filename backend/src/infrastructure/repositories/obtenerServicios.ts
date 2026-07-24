import { pool } from "../../config/db";

// Función async para obtener todos los servicios
export const obtenerServicios = async () => {

  const result = await pool.query(

    `
    SELECT * FROM servicios
    WHERE activo = true
    ORDER BY id_servicios ASC
    `
  );

  return result.rows;
};