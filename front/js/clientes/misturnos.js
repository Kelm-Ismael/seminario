(async function () {
    const { getDatos } = await import("../core/api.js");
    const { API_TURNOS, API_SERVICIOS, API_EMPLEADOS } = await import("../core/config.js");

    const CLIENTE_ID = 1; // TODO: reemplazar cuando haya login de cliente

    const el = {
        tabs: document.getElementById("turnosTabs"),
        lista: document.getElementById("turnosLista"),
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
        turnosCliente = turnos.filter(t => t.cliente_id === CLIENTE_ID);

        pintarTab("proximos");
        activarTabs();

    } catch (err) {
        console.error("Error cargando mis turnos:", err);
        el.lista.innerHTML = `<p class="mensaje">No se pudieron cargar tus turnos.</p>`;
    }

    function activarTabs() {
        el.tabs.addEventListener("click", (ev) => {
            const boton = ev.target.closest(".tab");
            if (!boton) return;
            el.tabs.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            boton.classList.add("active");
            pintarTab(boton.dataset.tab);
        });
    }

    function pintarTab(tab) {
        const ahora = new Date();

        const filtrados = tab === "proximos"
            ? turnosCliente.filter(t => new Date(t.fecha) >= ahora && t.estado !== "cancelado")
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            : turnosCliente.filter(t => new Date(t.fecha) < ahora || t.estado === "cancelado")
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        if (filtrados.length === 0) {
            el.lista.innerHTML = `<p class="mensaje">No tenés turnos ${tab === "proximos" ? "próximos" : "pasados"}.</p>`;
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
                    <h4>${formatoHora12(fecha)} · ${servicio ? servicio.nombre : "Servicio sin datos"}</h4>
                    <p>${empleado ? empleado.nombre : "Profesional sin datos"}</p>
                </div>
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

    function formatoHora12(fecha) {
        return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
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