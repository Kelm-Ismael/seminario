import { pool } from "../../config/db";

// Función async para actualizar un cliente
export const actualizarCliente = async (
  id: number,
  nombre: string,
  telefono: string,
  email: string,
  created_at: string
) => {

  // Ejecutamos query SQL
  const result = await pool.query(

    // Query para actualizar datos del cliente
    `
    UPDATE clientes
    SET nombre = $1,
        telefono = $2,
        email = $3,
        created_at = $4
    WHERE id = $5
    RETURNING *
    `,

    // Valores que reemplazan $1 $2 $3 $4 $5
    [nombre, telefono, email, created_at, id]
  );

  // Devuelve el cliente actualizado
  return result.rows[0];
};