export function filtrarTurnos(turnos, filtro) {

    return turnos.filter(turno => {

        const texto =
            `${turno.cliente_nombre}
             ${turno.empleado_nombre}
             ${turno.servicio_nombre}`
            .toLowerCase();


        return texto.includes(
            filtro.toLowerCase()
        );

    });
}