
// import { Pool } from "pg";
// import { DATABASE_URL, contraseña_db, host_db, nombre_db, puerto_db, usuario_db } from "./env";

// export const pool = DATABASE_URL
//   ? new Pool({
//       connectionString: DATABASE_URL,
//       ssl: { rejectUnauthorized: false }
//     })
//   : new Pool({
//       host: host_db,
//       user: usuario_db,
//       password: contraseña_db,
//       database: nombre_db,
//       port: Number(puerto_db),
//       ssl: host_db === "localhost" ? false : { rejectUnauthorized: false }
//     });

// console.log("DEBUG ENV → usando", DATABASE_URL ? "DATABASE_URL" : "variables sueltas");

// export const conexion_db = async () => {
//    try {
//     await pool.query("SELECT 1");
//     console.log("🟢 Conectado a Base de datos")
//   }catch (error) {
//     console.log("🔴 Error de Conexion a db:", error)
//   }
// };



//-----------------------------------------------------
//Para conectar a la base de datos de BK-SOFT 
//
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function conexion_db(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('\x1b[32m📦 Base de datos conectada exitosamente\x1b[0m');
    client.release();
  } catch (error) {
    console.error('\x1b[31m❌ Error al conectar a la base de datos:\x1b[0m', error);
    process.exit(1);
  }
}