import { pool } from "../../config/db";

// Función async para obtener todos los turnos
// export const obtenerTurnos = async () => {

//   // Ejecutamos una query SQL
//   // SELECT * trae todas las columnas
//   const result = await pool.query(

//     // Query para obtener todos los clientes
//     `
//     SELECT * FROM turnos
//     ORDER BY id_turnos ASC
//     `
//   );

//   // Devolvemos todas las filas encontradas
//   return result.rows;
// };

// Función async para obtener todos los turnos
export const obtenerTurnos = async () => {

  const result = await pool.query(

    `
    SELECT

      t.id_turnos,

      t.fecha,

      t.estado,

      c.nombre AS cliente_nombre,

      c.email AS cliente_email,

      s.nombre AS servicio_nombre,

      s.precio,

      s.duracion

    FROM turnos t

    INNER JOIN clientes c
      ON t.cliente_id = c.id_clientes

    INNER JOIN servicios s
      ON t.servicio_id = s.id_servicios

    ORDER BY t.id_turnos ASC
    `
  );

  return result.rows;
};