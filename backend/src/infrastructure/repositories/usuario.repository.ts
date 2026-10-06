import { pool } from "../../config/db.js";
import { Usuario } from "../../domain/entities/usuario.entity.js";

// Función async para crear un usuario (Escenario 2: Registrarse)
export const crearUsuario = async (
  email: string,
  passwordHash: string | null,
  estadoCuenta: string
) => {
  const result = await pool.query<Usuario>(
    `
    INSERT INTO usuarios (email, password_hash, estado_cuenta)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, passwordHash, estadoCuenta]
  );

  return result.rows[0];
};

// Busca un usuario por email (para validar que no esté repetido, y para el login más adelante)
export const buscarUsuarioPorEmail = async (email: string) => {
  const result = await pool.query<Usuario>(
    `SELECT * FROM usuarios WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

// Actualiza el estado de la cuenta (pendiente -> activo, al verificar el token)
export const actualizarEstadoCuenta = async (
  id_usuario: number,
  estadoCuenta: string
) => {
  const result = await pool.query<Usuario>(
    `
    UPDATE usuarios
    SET estado_cuenta = $1
    WHERE id_usuario = $2
    RETURNING *
    `,
    [estadoCuenta, id_usuario]
  );

  return result.rows[0];
};