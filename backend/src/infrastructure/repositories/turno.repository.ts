import { pool } from "../../config/db";

export const crearTurno = async (datos: any) => {
    const { cliente_id, empleado_id, servicio_id, fecha} = datos;

    const resultado = await pool.query(
        'INSERT INTO turnos (cliente_id, empleado_id, servicio_id, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
        [cliente_id, empleado_id, servicio_id, fecha]
    );
  
    return resultado.rows[0];
};

