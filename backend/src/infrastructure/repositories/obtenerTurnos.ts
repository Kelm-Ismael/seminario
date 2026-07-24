import { pool } from "../../config/db";

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

      e.nombre AS empleado_nombre,

      s.nombre AS servicio_nombre,

      s.precio,

      s.duracion

    FROM turnos t

    INNER JOIN clientes c
      ON t.cliente_id = c.id_clientes

    INNER JOIN empleados e
      ON t.empleado_id = e.id_empleados

    INNER JOIN servicios s
      ON t.servicio_id = s.id_servicios

    ORDER BY t.id_turnos ASC
    `
  );

  return result.rows;
};