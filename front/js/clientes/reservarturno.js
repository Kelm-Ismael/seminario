(async function () {
    const { getDatos, postDatos } = await import("../core/api.js");
    const { API_SERVICIOS, API_EMPLEADOS, API_TURNOS } = await import("../core/config.js");

    // TODO: reemplazar por el id real cuando exista login de cliente
    const CLIENTE_ID = 1;

    const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const HORARIOS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

    const el = {
        servicios: document.getElementById("serviciosContainer"),
        profesionales: document.getElementById("profesionalesContainer"),
        calendarioTitulo: document.getElementById("calendarioMesAno"),
        calendarioGrid: document.getElementById("calendarioGrid"),
        timeSlots: document.getElementById("timeSlotsContainer"),
        resumenServicio: document.getElementById("resumenServicio"),
        resumenProfesional: document.getElementById("resumenProfesional"),
        resumenFecha: document.getElementById("resumenFecha"),
        resumenHora: document.getElementById("resumenHora"),
        resumenPrecio: document.getElementById("resumenPrecio"),
        btnContinuar: document.getElementById("btnContinuar"),
        mensaje: document.getElementById("mensajeReserva"),
        stepperSteps: document.querySelectorAll(".stepper-full .step"),
    };

    // Si esta página no está montada en el DOM ahora mismo, no seguimos
    // (pasa si panel-cliente.js ya navegó a otra sección).
    if (!el.servicios) return;

    const estado = {
        servicios: [],
        empleados: [],
        servicioSeleccionado: null,
        empleadoSeleccionado: null,
        fechaMostrada: new Date(),
        diaSeleccionado: null,
        horaSeleccionada: null,
        enviando: false,
    };

    activarCalendarioNav();
    activarBotonContinuar();
    pintarCalendario();
    pintarHorarios();

    try {
        const [servicios, empleados] = await Promise.all([
            getDatos(API_SERVICIOS),
            getDatos(API_EMPLEADOS),
        ]);
        estado.servicios = servicios;
        estado.empleados = empleados;
        pintarServicios();
        pintarProfesionales();
    } catch (err) {
        console.error("Error cargando servicios/profesionales:", err);
        el.servicios.innerHTML = `<p class="mensaje">No se pudieron cargar los servicios.</p>`;
        el.profesionales.innerHTML = `<p class="mensaje">No se pudieron cargar los profesionales.</p>`;
    }

    /* ================= SERVICIOS ================= */
    function pintarServicios() {
        if (estado.servicios.length === 0) {
            el.servicios.innerHTML = `<p class="mensaje">Todavía no hay servicios cargados.</p>`;
            return;
        }
        el.servicios.innerHTML = estado.servicios.map(s => `
            <div class="service-card" data-id="${s.id_servicios}">
                <div class="icon">✂️</div>
                <h4>${s.nombre}</h4>
                <p>${s.duracion} min · ${formatoMoneda(s.precio)}</p>
            </div>
        `).join("");
        el.servicios.addEventListener("click", onSeleccionarServicio);
    }

    function onSeleccionarServicio(ev) {
        const card = ev.target.closest(".service-card");
        if (!card) return;
        el.servicios.querySelectorAll(".service-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        const id = Number(card.dataset.id);
        estado.servicioSeleccionado = estado.servicios.find(s => s.id_servicios === id) || null;
        actualizarResumen();
    }

    /* ================= PROFESIONALES ================= */
    function pintarProfesionales() {
        if (estado.empleados.length === 0) {
            el.profesionales.innerHTML = `<p class="mensaje">Todavía no hay profesionales cargados.</p>`;
            return;
        }
        el.profesionales.innerHTML = estado.empleados.map(e => `
            <div class="professional-card" data-id="${e.id_empleados}">
                <div class="avatar-initials avatar-sm">${iniciales(e.nombre)}</div>
                <h4>${e.nombre}</h4>
                <p>Estilista</p>
            </div>
        `).join("");
        el.profesionales.addEventListener("click", onSeleccionarProfesional);
    }

    function onSeleccionarProfesional(ev) {
        const card = ev.target.closest(".professional-card");
        if (!card) return;
        el.profesionales.querySelectorAll(".professional-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        const id = Number(card.dataset.id);
        estado.empleadoSeleccionado = estado.empleados.find(e => e.id_empleados === id) || null;
        actualizarResumen();
    }

    /* ================= CALENDARIO ================= */
    function activarCalendarioNav() {
        const botones = document.querySelectorAll(".calendar-header button");
        if (botones[0]) botones[0].addEventListener("click", () => cambiarMes(-1));
        if (botones[1]) botones[1].addEventListener("click", () => cambiarMes(1));
    }

    function cambiarMes(delta) {
        estado.fechaMostrada = new Date(estado.fechaMostrada.getFullYear(), estado.fechaMostrada.getMonth() + delta, 1);
        pintarCalendario();
    }

    function pintarCalendario() {
        const anio = estado.fechaMostrada.getFullYear();
        const mes = estado.fechaMostrada.getMonth();
        el.calendarioTitulo.textContent = `${MESES[mes]} ${anio}`;

        const primerDiaMes = new Date(anio, mes, 1);
        const offsetLunes = (primerDiaMes.getDay() + 6) % 7;
        const diasEnMes = new Date(anio, mes + 1, 0).getDate();
        const diasMesAnterior = new Date(anio, mes, 0).getDate();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        let celdas = "";
        celdas += DIAS_SEMANA.slice(1).concat(DIAS_SEMANA[0]).map(d => `<div class="weekday">${d}</div>`).join("");

        for (let i = offsetLunes; i > 0; i--) {
            celdas += `<div class="day muted">${diasMesAnterior - i + 1}</div>`;
        }

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(anio, mes, dia);
            const esPasado = fecha < hoy;
            const esSeleccionado = estado.diaSeleccionado
                && fecha.getFullYear() === estado.diaSeleccionado.getFullYear()
                && fecha.getMonth() === estado.diaSeleccionado.getMonth()
                && fecha.getDate() === estado.diaSeleccionado.getDate();

            const clases = ["day"];
            if (esPasado) clases.push("muted");
            if (esSeleccionado) clases.push("selected");

            celdas += `<div class="${clases.join(" ")}" ${esPasado ? "" : `data-fecha="${fecha.toISOString()}"`}>${dia}</div>`;
        }

        const totalCeldas = offsetLunes + diasEnMes;
        const sobrantes = (7 - (totalCeldas % 7)) % 7;
        for (let i = 1; i <= sobrantes; i++) {
            celdas += `<div class="day muted">${i}</div>`;
        }

        el.calendarioGrid.innerHTML = celdas;
        el.calendarioGrid.querySelectorAll(".day:not(.muted)").forEach(dia => {
            dia.addEventListener("click", onSeleccionarDia);
        });
    }

    function onSeleccionarDia(ev) {
        const celda = ev.currentTarget;
        const fecha = new Date(celda.dataset.fecha);
        estado.diaSeleccionado = fecha;
        el.calendarioGrid.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
        celda.classList.add("selected");
        actualizarResumen();
    }

    /* ================= HORARIOS ================= */
    function pintarHorarios() {
        el.timeSlots.innerHTML = HORARIOS.map(h => `
            <div class="time-slot" data-hora="${h}">${formatoHora12(h)}</div>
        `).join("");
        el.timeSlots.addEventListener("click", onSeleccionarHorario);
    }

    function onSeleccionarHorario(ev) {
        const slot = ev.target.closest(".time-slot");
        if (!slot) return;
        el.timeSlots.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
        slot.classList.add("selected");
        estado.horaSeleccionada = slot.dataset.hora;
        actualizarResumen();
    }

    /* ================= RESUMEN + ENVÍO ================= */
    function actualizarResumen() {
        el.resumenServicio.textContent = estado.servicioSeleccionado ? estado.servicioSeleccionado.nombre : "-";
        el.resumenProfesional.textContent = estado.empleadoSeleccionado ? estado.empleadoSeleccionado.nombre : "-";
        el.resumenFecha.textContent = estado.diaSeleccionado ? formatoFechaCorta(estado.diaSeleccionado) : "-";
        el.resumenHora.textContent = estado.horaSeleccionada ? formatoHora12(estado.horaSeleccionada) : "-";
        el.resumenPrecio.textContent = estado.servicioSeleccionado ? formatoMoneda(estado.servicioSeleccionado.precio) : "-";
    }

    function activarBotonContinuar() {
        el.btnContinuar.addEventListener("click", confirmarReserva);
    }

    async function confirmarReserva() {
        if (estado.enviando) return;
        limpiarMensaje();

        if (!estado.servicioSeleccionado) return mostrarMensaje("Elegí un servicio para continuar.", "error");
        if (!estado.empleadoSeleccionado) return mostrarMensaje("Elegí un profesional para continuar.", "error");
        if (!estado.diaSeleccionado) return mostrarMensaje("Elegí una fecha para continuar.", "error");
        if (!estado.horaSeleccionada) return mostrarMensaje("Elegí un horario para continuar.", "error");

        const fechaIso = construirFechaISO(estado.diaSeleccionado, estado.horaSeleccionada);

        const turno = {
            cliente_id: CLIENTE_ID,
            empleado_id: estado.empleadoSeleccionado.id_empleados,
            servicio_id: estado.servicioSeleccionado.id_servicios,
            fecha: fechaIso,
            estado: "pendiente",
        };

        try {
            estado.enviando = true;
            el.btnContinuar.disabled = true;
            el.btnContinuar.textContent = "Reservando…";

            const respuesta = await postDatos(API_TURNOS, turno);
            if (!respuesta.ok) throw new Error("El servidor rechazó la reserva");

            marcarStepperCompleto();
            mostrarMensaje("¡Turno reservado con éxito! Te esperamos.", "exito");
            el.btnContinuar.textContent = "Turno reservado ✓";

        } catch (err) {
            console.error("Error creando el turno:", err);
            mostrarMensaje("No se pudo reservar el turno. Probá de nuevo en unos segundos.", "error");
            el.btnContinuar.disabled = false;
            el.btnContinuar.textContent = "Continuar a confirmación";
        } finally {
            estado.enviando = false;
        }
    }

    function marcarStepperCompleto() {
        el.stepperSteps.forEach(paso => {
            paso.classList.remove("current");
            paso.classList.add("done");
        });
    }

    /* ================= HELPERS ================= */
    function construirFechaISO(fecha, hora) {
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, "0");
        const dd = String(fecha.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hora}`;
    }

    function formatoHora12(hora24) {
        const [h, m] = hora24.split(":").map(Number);
        const periodo = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 === 0 ? 12 : h % 12;
        return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${periodo}`;
    }

    function formatoFechaCorta(fecha) {
        const texto = fecha.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    function formatoMoneda(valor) {
        return "$" + Math.round(valor || 0).toLocaleString("es-AR");
    }

    function iniciales(nombre) {
        if (!nombre) return "??";
        return nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join("");
    }

    function mostrarMensaje(texto, tipo) {
        el.mensaje.textContent = texto;
        el.mensaje.style.color = tipo === "error" ? "var(--danger)" : "var(--success)";
    }

    function limpiarMensaje() {
        el.mensaje.textContent = "";
    }
})();