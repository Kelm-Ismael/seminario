import { pool } from "../../config/db";

// Función async para obtener un cliente por su id
export const obtenerClientePorId = async (id: number) => {

  // Ejecutamos query SQL
  const result = await pool.query(

    // Query para buscar un cliente específico
    `
    SELECT * FROM clientes
    WHERE id = $1
    `,

    // Reemplaza $1 por el id recibido
    [id]
  );

  // Devuelve el primer cliente encontrado
  return result.rows[0];
};