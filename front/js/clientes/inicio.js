(async function () {
    const { getDatos } = await import("../core/api.js");
    const { API_TURNOS, API_SERVICIOS, API_EMPLEADOS, API_CLIENTES } = await import("../core/config.js");

    // TODO: reemplazar por el id real cuando exista login de cliente
    const CLIENTE_ID = 1;

    const el = {
        saludoTitulo: document.getElementById("saludoTitulo"),
        avatarIniciales: document.getElementById("avatarIniciales"),
        nombreUsuario: document.getElementById("nombreUsuario"),
        proximoTurnoBox: document.getElementById("proximoTurnoBox"),
        historialTbody: document.getElementById("historialTbody"),
    };

    // Si esta página no está montada (por ej. otra sección la reemplazó
    // justo cuando este script llegó a ejecutarse), no seguimos.
    if (!el.saludoTitulo) return;

    try {
        const [turnos, servicios, empleados, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_EMPLEADOS),
            getDatos(API_CLIENTES),
        ]);

        const cliente = clientes.find(c => c.id_clientes === CLIENTE_ID);
        const serviciosPorId = indexarPorId(servicios, "id_servicios");
        const empleadosPorId = indexarPorId(empleados, "id_empleados");
        const turnosCliente = turnos.filter(t => t.cliente_id === CLIENTE_ID);

        pintarSaludo(cliente);
        pintarProximoTurno(turnosCliente, serviciosPorId, empleadosPorId);
        pintarHistorialReciente(turnosCliente, serviciosPorId, empleadosPorId);

    } catch (err) {
        console.error("Error cargando el inicio del cliente:", err);
        el.proximoTurnoBox.innerHTML = `<p class="mensaje">No se pudo cargar tu próximo turno.</p>`;
        el.historialTbody.innerHTML = `<tr><td colspan="5">No se pudo cargar el historial.</td></tr>`;
    }

    function pintarSaludo(cliente) {
        const nombre = cliente ? cliente.nombre : "Cliente";
        el.saludoTitulo.textContent = `Hola, ${nombre} 👋`;
        el.nombreUsuario.textContent = nombre;
        el.avatarIniciales.textContent = iniciales(nombre);
    }

    function pintarProximoTurno(turnosCliente, serviciosPorId, empleadosPorId) {
        const ahora = new Date();
        const proximo = turnosCliente
            .filter(t => new Date(t.fecha) >= ahora && t.estado !== "cancelado")
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];

        if (!proximo) {
            el.proximoTurnoBox.innerHTML = `<p class="mensaje">No tenés turnos próximos.</p>`;
            return;
        }

        const servicio = serviciosPorId[proximo.servicio_id];
        const empleado = empleadosPorId[proximo.empleado_id];
        const fecha = new Date(proximo.fecha);

        el.proximoTurnoBox.innerHTML = `
            <div class="turno-fecha-box">
                <div class="hora">${formatoHora12(fecha)}</div>
            </div>
            <div class="turno-info">
                <h4>${formatoFechaLarga(fecha)}</h4>
                <p>${servicio ? servicio.nombre : "Servicio sin datos"}</p>
                <p>${empleado ? empleado.nombre : "Profesional sin datos"}</p>
            </div>
        `;
    }

    function pintarHistorialReciente(turnosCliente, serviciosPorId, empleadosPorId) {
        const recientes = [...turnosCliente]
            .filter(t => t.estado === "finalizado" || t.estado === "cancelado")
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 3);

        if (recientes.length === 0) {
            el.historialTbody.innerHTML = `<tr><td colspan="5">Todavía no tenés turnos en tu historial.</td></tr>`;
            return;
        }

        el.historialTbody.innerHTML = recientes.map(t => {
            const servicio = serviciosPorId[t.servicio_id];
            const empleado = empleadosPorId[t.empleado_id];
            const badge = badgeInfo(t.estado);
            const fecha = new Date(t.fecha).toLocaleDateString("es-AR");

            return `
            <tr>
                <td class="persona">
                    <div class="avatar-initials avatar-xs">${iniciales(empleado ? empleado.nombre : "??")}</div>
                    ${servicio ? servicio.nombre : "Servicio sin datos"}
                </td>
                <td>${empleado ? empleado.nombre : "-"}</td>
                <td>${fecha}</td>
                <td>${servicio ? formatoMoneda(servicio.precio) : "-"}</td>
                <td><span class="badge ${badge.clase}">${badge.texto}</span></td>
            </tr>`;
        }).join("");
    }

    /* -------- helpers -------- */
    function indexarPorId(lista, campoId) {
        const mapa = {};
        for (const item of lista) mapa[item[campoId]] = item;
        return mapa;
    }

    function iniciales(nombre) {
        if (!nombre) return "??";
        return nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join("");
    }

    function formatoMoneda(valor) {
        return "$" + Math.round(valor || 0).toLocaleString("es-AR");
    }

    function formatoHora12(fecha) {
        return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    }

    function formatoFechaLarga(fecha) {
        const texto = fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    function badgeInfo(estado) {
        const mapa = {
            finalizado: { texto: "Completado", clase: "badge-completado" },
            cancelado: { texto: "Cancelado", clase: "badge-cancelado" },
            confirmado: { texto: "Confirmado", clase: "badge-confirmado" },
            pendiente: { texto: "Pendiente", clase: "badge-pendiente" },
        };
        return mapa[estado] || { texto: estado, clase: "" };
    }
})();