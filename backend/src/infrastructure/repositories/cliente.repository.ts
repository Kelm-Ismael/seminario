import { pool } from "../../config/db.js";
import { Cliente } from "../../domain/entities/cliente.entity.js";

// Perfil de cliente creado durante el registro (Escenario 2).
// id_usuario es el id del usuario recién creado en `usuarios`;
// se inserta como id_cliente porque es tabla-per-type.
//
// NOTA: el CRUD viejo de clientes (alta manual por el administrador,
// Escenario 13) todavía vive en el repo sincronizado de GitHub con
// otro esquema (nombre/telefono/email) que ya no coincide con la
// tabla actual. A propósito no se migró acá todavía — se decide
// cuando toque ese escenario.
export const crearClienteDesdeRegistro = async (
  id_usuario: number,
  nombre: string,
  apellido: string,
  fecha_nacimiento: string | null,
  celular: string | null
) => {
  const result = await pool.query<Cliente>(
    `
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_nacimiento, celular)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [id_usuario, nombre, apellido, fecha_nacimiento, celular]
  );

  return result.rows[0];
};

// NUEVO — registro por canal Google SSO (Escenario 2, variante Google).
// Igual que crearClienteDesdeRegistro pero además guarda el id_google_sso
// (el "sub" del token de Google), que es lo que identifica a la cuenta de
// Google de forma única y estable.
export const crearClienteDesdeRegistroGoogle = async (
  id_usuario: number,
  nombre: string,
  apellido: string,
  fecha_nacimiento: string,
  celular: string,
  id_google_sso: string
) => {
  const result = await pool.query<Cliente>(
    `
    INSERT INTO clientes (id_cliente, nombre, apellido, fecha_nacimiento, celular, id_google_sso)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [id_usuario, nombre, apellido, fecha_nacimiento, celular, id_google_sso]
  );

  return result.rows[0];
};

// NUEVO — para chequear si ya existe una cuenta creada con ese Google ID
// (evita duplicados si alguien ya se registró con esa cuenta de Google).
export const buscarClientePorGoogleId = async (id_google_sso: string) => {
  const result = await pool.query<Cliente>(
    `SELECT * FROM clientes WHERE id_google_sso = $1`,
    [id_google_sso]
  );

  return result.rows[0];
};