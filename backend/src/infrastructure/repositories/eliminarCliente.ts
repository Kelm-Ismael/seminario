import { pool } from "../../config/db";

// Función async para eliminar un cliente
export const eliminarCliente = async (id: number) => {

  // Ejecutamos query SQL
  const result = await pool.query(

    // Query para eliminar un cliente por id
    `
    DELETE FROM clientes
    WHERE id = $1
    RETURNING *
    `,

    // Reemplaza $1 por el id recibido
    [id]
  );

  // Devuelve el cliente eliminado
  return result.rows[0];
};