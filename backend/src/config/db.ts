// src/config/db.ts

// import {Pool} from "pg";
// import { contraseña_db, host_db, nombre_db, puerto_db, usuario_db } from "./env";

import { Pool } from "pg";
import { DATABASE_URL, contraseña_db, host_db, nombre_db, puerto_db, usuario_db } from "./env";

export const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: host_db,
      user: usuario_db,
      password: contraseña_db,
      database: nombre_db,
      port: Number(puerto_db),
      ssl: host_db === "localhost" ? false : { rejectUnauthorized: false }
    });

console.log("DEBUG ENV → usando", DATABASE_URL ? "DATABASE_URL" : "variables sueltas");

export const conexion_db = async () => {
   try {
    await pool.query("SELECT 1");
    console.log("🟢 Conectado a Base de datos")
  }catch (error) {
    console.log("🔴 Error de Conexion a db:", error)
  }
};

// //Instancia env.ts
// export const pool = new Pool ({
//   host : host_db, //servidor db
//   user: usuario_db, //usuario
//   password: contraseña_db, //contraseña
//   database: nombre_db, // nombre db
//   port: Number(puerto_db)
// });

//prueba de conexion a db

// export const conexion_db = async () => {
//    try {
//     await pool.query("SELECT 1");
//     console.log("🟢 Conectado a Base de datos")
//   }catch (error) {
//     console.log("🔴 Error de Conexion a db:", error)

//   }
// };
