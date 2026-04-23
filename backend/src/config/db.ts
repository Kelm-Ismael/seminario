// src/config/db.ts

import {Pool} from "pg";
import { contraseña_db, host_db, nombre_db, puerto_db, usuario_db } from "./env";

//Instancia env.ts
export { host_db } from "./env";
 const pool = new Pool ({
  host : host_db, //servidor db
  user: usuario_db, //usuario
  password: contraseña_db, //contraseña
  database: nombre_db, // nombre db
  port: Number(puerto_db)
});

//prueba de conexion a db

export const conexion_db = async () => {
   try {
    await pool.query("SELECT 1");
    console.log("🟢 Conectado a Base de datos")
  }catch (error) {
    console.log("🔴 Error de Conexion a db:", error)

  }
};
