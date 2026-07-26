import { pool } from "../../config/db";

// Crear turno (ya existente)
export const crearTurno = async (datos: any) => {
    const { cliente_id, empleado_id, servicio_id, fecha } = datos;

    const resultado = await pool.query(
        'INSERT INTO turnos (cliente_id, empleado_id, servicio_id, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
        [cliente_id, empleado_id, servicio_id, fecha]
    );

    return resultado.rows[0];
};

// Obtener un turno por id (con datos de cliente/empleado/servicio)
// export const obtenerTurnoPorId = async (id: number) => {

//     const resultado = await pool.query(
//         `
//         SELECT
//             t.id_turnos,
//             t.fecha,
//             t.estado,
//             t.cliente_id,
//             t.empleado_id,
//             t.servicio_id,
//             c.nombre AS cliente_nombre,
//             c.email AS cliente_email,
//             e.nombre AS empleado_nombre,
//             s.nombre AS servicio_nombre,
//             s.precio,
//             s.duracion
//         FROM turnos t
//         INNER JOIN clientes c ON t.cliente_id = c.id_clientes
//         INNER JOIN empleados e ON t.empleado_id = e.id_empleados
//         INNER JOIN servicios s ON t.servicio_id = s.id_servicios
//         WHERE t.id_turnos = $1
//         `,
//         [id]
//     );

//     return resultado.rows[0];
// };

export const obtenerTurnoPorId = async (id: number) => {

    const resultado = await pool.query(
        `
        SELECT
            t.id_turnos,
            t.fecha,
            t.estado,
            t.cliente_id,
            t.empleado_id,
            t.servicio_id,
            c.nombre AS cliente_nombre,
            c.email AS cliente_email,
            c.telefono AS cliente_telefono,
            e.nombre AS empleado_nombre,
            s.nombre AS servicio_nombre,
            s.precio,
            s.duracion
        FROM turnos t
        INNER JOIN clientes c ON t.cliente_id = c.id_clientes
        INNER JOIN empleados e ON t.empleado_id = e.id_empleados
        INNER JOIN servicios s ON t.servicio_id = s.id_servicios
        WHERE t.id_turnos = $1
        `,
        [id]
    );

    return resultado.rows[0];
};

// // Actualizar fecha y/o estado de un turno
// export const actualizarTurno = async (
//     id: number,
//     fecha: string,
//     estado: string
// ) => {

//     const resultado = await pool.query(
//         `
//         UPDATE turnos
//         SET fecha = $1,
//             estado = $2
//         WHERE id_turnos = $3
//         RETURNING *
//         `,
//         [fecha, estado, id]
//     );

//     return resultado.rows[0];
// };

export const actualizarTurno = async (
    id: number,
    empleado_id: number,
    fecha: string,
    estado: string
) => {

    const resultado = await pool.query(
        `
        UPDATE turnos
        SET empleado_id = $1,
            fecha = $2,
            estado = $3
        WHERE id_turnos = $4
        RETURNING *
        `,
        [
            empleado_id,
            fecha,
            estado,
            id
        ]
    );

    return resultado.rows[0];
};

// Cancelar turno (baja lógica: cambia estado a 'cancelado', no borra el registro)
export const cancelarTurno = async (id: number) => {

    const resultado = await pool.query(
        `
        UPDATE turnos
        SET estado = 'cancelado'
        WHERE id_turnos = $1
        RETURNING *
        `,
        [id]
    );

    return resultado.rows[0];
};

// Verifica si un empleado ya tiene un turno activo (no cancelado) en esa fecha/hora exacta.
// excluirTurnoId sirve para, al actualizar, no chocar contra sí mismo.
export const existeTurnoEnHorario = async (
    empleado_id: number,
    fecha: string,
    excluirTurnoId?: number
) => {

    const resultado = await pool.query(
        `
        SELECT id_turnos FROM turnos
        WHERE empleado_id = $1
          AND fecha = $2
          AND estado != 'cancelado'
          AND id_turnos != COALESCE($3, -1)
        `,
        [empleado_id, fecha, excluirTurnoId ?? null]
    );

    return (resultado.rowCount ?? 0) > 0;
};

// Turnos de mañana, no cancelados, con teléfono del cliente
export const obtenerTurnosDeManana = async () => {

    const resultado = await pool.query(
        `
        SELECT
            t.id_turnos,
            t.fecha,
            c.nombre AS cliente_nombre,
            c.telefono AS cliente_telefono,
            e.nombre AS empleado_nombre,
            s.nombre AS servicio_nombre
        FROM turnos t
        INNER JOIN clientes c ON t.cliente_id = c.id_clientes
        INNER JOIN empleados e ON t.empleado_id = e.id_empleados
        INNER JOIN servicios s ON t.servicio_id = s.id_servicios
        WHERE t.fecha::date = (CURRENT_DATE + INTERVAL '1 day')::date
          AND t.estado != 'cancelado'
          AND c.telefono IS NOT NULL
          AND c.telefono != ''
        `
    );

    return resultado.rows;
};