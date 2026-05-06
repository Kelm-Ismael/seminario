import { pool } from "../../config/db";

// Función async para obtener todos los clientes
export const obtenerClientes = async () => {

  // Ejecutamos una query SQL
  // SELECT * trae todas las columnas
  const result = await pool.query(

    // Query para obtener todos los clientes
    `
    SELECT * FROM clientes
    ORDER BY id ASC
    `
  );

  // Devolvemos todas las filas encontradas
  return result.rows;
};