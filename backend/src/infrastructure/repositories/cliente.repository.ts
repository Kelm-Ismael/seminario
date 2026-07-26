//  conexión a la base de datos
import { pool } from "../../config/db";


// Función async para crear un cliente
// async permite usar await dentro
export const crearCliente = async (nombre: string, telefono: string, email: string, created_at: string) => {

  // Ejecutamos una query SQL
  // await espera la respuesta de la base de datos
  const result = await pool.query(

    // Query SQL para insertar un cliente
    `
    INSERT INTO clientes (nombre, telefono, email, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,

    // Valores que reemplazan $1 $2 $3 $4
    // Evita SQL Injection
    [nombre, telefono, email, created_at]
  );

  // result.rows contiene las filas devueltas
  // [0] porque queremos el primer registro insertado
  return result.rows[0];
};



// ===============================
// OBTENER CLIENTES
// ===============================
export const obtenerClientes = async () => {

  const result = await pool.query(

    `
    SELECT * FROM public.clientes 
    ORDER BY id_clientes ASC 
    `
  );

  return result.rows;
};