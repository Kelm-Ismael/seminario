(async function () {
    const { getDatos } = await import("../core/api.js");
    const { API_TURNOS, API_SERVICIOS, API_EMPLEADOS } = await import("../core/config.js");

    const CLIENTE_ID = 1; // TODO: reemplazar cuando haya login de cliente

    const el = {
        tabs: document.getElementById("historialTabs"),
        lista: document.getElementById("historialLista"),
    };
    if (!el.tabs) return;

    let turnosCliente = [];
    let serviciosPorId = {};
    let empleadosPorId = {};

    try {
        const [turnos, servicios, empleados] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_EMPLEADOS),
        ]);

        serviciosPorId = indexarPorId(servicios, "id_servicios");
        empleadosPorId = indexarPorId(empleados, "id_empleados");
        turnosCliente = turnos
            .filter(t => t.cliente_id === CLIENTE_ID)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        pintarTab("todos");
        activarTabs();

    } catch (err) {
        console.error("Error cargando el historial:", err);
        el.lista.innerHTML = `<p class="mensaje">No se pudo cargar el historial.</p>`;
    }

    function activarTabs() {
        el.tabs.addEventListener("click", (ev) => {
            const boton = ev.target.closest(".tab");
            if (!boton) return;
            el.tabs.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            boton.classList.add("active");
            pintarTab(boton.dataset.estado);
        });
    }

    function pintarTab(filtro) {
        // "no_asistido" no existe en el modelo de datos actual.
        const filtrados = filtro === "todos"
            ? turnosCliente
            : filtro === "no_asistido"
                ? []
                : turnosCliente.filter(t => t.estado === filtro);

        if (filtro === "no_asistido") {
            el.lista.innerHTML = `<p class="mensaje">El sistema todavía no registra turnos como "no asistido".</p>`;
            return;
        }

        if (filtrados.length === 0) {
            el.lista.innerHTML = `<p class="mensaje">No hay turnos para mostrar acá.</p>`;
            return;
        }

        el.lista.innerHTML = filtrados.map(t => {
            const servicio = serviciosPorId[t.servicio_id];
            const empleado = empleadosPorId[t.empleado_id];
            const badge = badgeInfo(t.estado);
            const fecha = new Date(t.fecha);

            return `
            <div class="turno-item">
                <div class="fecha-box">
                    <div class="dia-semana">${fecha.toLocaleDateString("es-AR", { weekday: "short" })}</div>
                    <div class="dia-num">${String(fecha.getDate()).padStart(2, "0")}</div>
                    <div class="mes">${fecha.toLocaleDateString("es-AR", { month: "short" })}</div>
                </div>
                <div class="info">
                    <h4>${servicio ? servicio.nombre : "Servicio sin datos"}</h4>
                    <p>${empleado ? empleado.nombre : "Profesional sin datos"}</p>
                    <p>${fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span class="precio">${servicio ? formatoMoneda(servicio.precio) : "-"}</span>
                <span class="badge ${badge.clase}">${badge.texto}</span>
                <div class="acciones">
                    <button class="btn-outline btn-sm">Ver detalle</button>
                </div>
            </div>`;
        }).join("");
    }

    function indexarPorId(lista, campoId) {
        const mapa = {};
        for (const item of lista) mapa[item[campoId]] = item;
        return mapa;
    }

    function formatoMoneda(valor) {
        return "$" + Math.round(valor || 0).toLocaleString("es-AR");
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