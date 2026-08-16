import { getDatos, postDatos } from "../core/api.js";
import { API_TURNOS, API_SERVICIOS, API_EMPLEADOS, API_CLIENTES } from "../core/config.js";
import {
    indexarPorId, formatoHora, formatoFechaCorta, formatoMoneda, capitalizar,
    pintarTopbar, inicializarShell, cambiarEstadoTurno, iniciales,
} from "./common.js";

const ESTADOS = ["pendiente", "confirmado", "finalizado", "cancelado"];
const DOW = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const PASO_MIN = 30; // tamaño de cada casillero de la grilla, en minutos

// Horario de atención del negocio (Escenario 43 del backlog — hoy hardcodeado
// acá porque el módulo de Configuración todavía no expone un endpoint;
// cuando exista, reemplazar esta constante por el dato real del backend).
// 0=domingo ... 6=sábado
const HORARIO_ATENCION = {
    0: null,                          // domingo: cerrado
    1: { inicio: "09:00", fin: "21:00" },
    2: { inicio: "09:00", fin: "21:00" },
    3: { inicio: "09:00", fin: "21:00" },
    4: { inicio: "09:00", fin: "21:00" },
    5: { inicio: "09:00", fin: "21:00" },
    6: { inicio: "09:00", fin: "21:00" },
};

let todosLosTurnos = [];
let todosLosServicios = [];
let todosLosEmpleados = [];
let serviciosPorId = {};
let empleadosPorId = {};
let clientesPorId = {};

// Estado del selector de fecha/hora dentro de "Nuevo turno"
let mesCalendario = new Date();
mesCalendario.setDate(1);
let diaSeleccionado = null;   // Date
let empleadoSeleccionado = null; // id
let servicioSeleccionado = null; // id
let horaSeleccionada = null;  // "HH:MM"

init();

async function init() {
    pintarTopbar();
    inicializarShell();
    document.querySelector(".panel-greeting p").textContent = "Alta y gestión de todos los turnos";

    document.getElementById("form-turno").addEventListener("submit", onCrearTurno);
    document.getElementById("buscar-turno").addEventListener("input", renderizarTabla);
    document.getElementById("filtro-estado-turno").addEventListener("change", renderizarTabla);
    document.getElementById("turno-servicio").addEventListener("change", onCambiarServicio);

    await cargarDatos();
}

async function cargarDatos() {
    try {
        const [turnos, servicios, empleados, clientes] = await Promise.all([
            getDatos(API_TURNOS),
            getDatos(API_SERVICIOS),
            getDatos(API_EMPLEADOS),
            getDatos(API_CLIENTES),
        ]);

        todosLosTurnos = turnos;
        todosLosServicios = servicios;
        todosLosEmpleados = empleados;
        serviciosPorId = indexarPorId(servicios, "id_servicios");
        empleadosPorId = indexarPorId(empleados, "id_empleados");
        clientesPorId = indexarPorId(clientes, "id_clientes");

        pintarSelect("turno-cliente", clientes, "id_clientes", "nombre");
        pintarSelect("turno-servicio", servicios, "id_servicios", "nombre");
        pintarSelectorEmpleados(empleados);
        pintarCalendario();
        renderizarTabla();

    } catch (err) {
        console.error("Error cargando turnos:", err);
        document.getElementById("tabla-turnos").innerHTML =
            `<tr><td colspan="8">No se pudieron cargar los turnos. Probá recargar la página.</td></tr>`;
    }
}

function pintarSelect(idSelect, lista, campoId, campoNombre) {
    const select = document.getElementById(idSelect);
    lista.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item[campoId];
        opt.textContent = item[campoNombre];
        select.appendChild(opt);
    });
}

/* ============================================================
   Selector de empleado (chips con avatar)
============================================================ */
function pintarSelectorEmpleados(empleados) {
    const contenedor = document.getElementById("empleado-selector");
    contenedor.innerHTML = empleados.map(e => `
        <div class="empleado-chip" data-id="${e.id_empleados}">
            <span class="avatar-initials">${iniciales(e.nombre)}</span>
            ${e.nombre}
        </div>
    `).join("");

    contenedor.querySelectorAll(".empleado-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            empleadoSeleccionado = Number(chip.dataset.id);
            document.getElementById("turno-empleado").value = empleadoSeleccionado;
            contenedor.querySelectorAll(".empleado-chip").forEach(c => c.classList.remove("seleccionado"));
            chip.classList.add("seleccionado");
            horaSeleccionada = null;
            pintarCalendario();
            pintarHorarios();
        });
    });
}

function onCambiarServicio() {
    servicioSeleccionado = Number(document.getElementById("turno-servicio").value) || null;
    horaSeleccionada = null;
    pintarHorarios();
}

/* ============================================================
   Minicalendario
============================================================ */
function pintarCalendario() {
    const cont = document.getElementById("calendario-mini");
    const anio = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();
    const nombreMes = mesCalendario.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

    const primerDiaSemana = new Date(anio, mes, 1).getDay(); // 0=dom
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const hoy = new Date();

    let celdas = "";
    // relleno de días del mes anterior
    for (let i = 0; i < primerDiaSemana; i++) celdas += `<div class="cal-day otro-mes"></div>`;

    for (let d = 1; d <= diasEnMes; d++) {
        const fecha = new Date(anio, mes, d);
        const dow = fecha.getDay();
        const cerrado = HORARIO_ATENCION[dow] === null;
        const esHoy = fecha.toDateString() === hoy.toDateString();
        const esSeleccionado = diaSeleccionado && fecha.toDateString() === diaSeleccionado.toDateString();

        let clases = "cal-day";
        if (cerrado) clases += " cerrado";
        if (esHoy) clases += " hoy";
        if (esSeleccionado) clases += " seleccionado";

        let dot = "";
        if (!cerrado && empleadoSeleccionado) {
            const nivel = nivelOcupacionDia(fecha, empleadoSeleccionado);
            dot = `<span class="cal-dot ${nivel}"></span>`;
        }

        celdas += `<div class="${clases}" data-fecha="${fecha.toISOString()}">${d}${dot}</div>`;
    }

    cont.innerHTML = `
        <div class="cal-header">
            <h4>${capitalizar(nombreMes)}</h4>
            <div class="cal-nav">
                <button type="button" id="cal-prev">‹</button>
                <button type="button" id="cal-hoy-btn">Hoy</button>
                <button type="button" id="cal-next">›</button>
            </div>
        </div>
        <div class="cal-grid">
            ${DOW.map(d => `<div class="cal-dow">${d}</div>`).join("")}
            ${celdas}
        </div>
        <div class="cal-leyenda">
            <span><span class="cal-dot disponible"></span> Disponible</span>
            <span><span class="cal-dot pocos"></span> Pocos turnos</span>
            <span><span class="cal-dot completo"></span> Completo</span>
        </div>
    `;

    document.getElementById("cal-prev").addEventListener("click", () => cambiarMes(-1));
    document.getElementById("cal-next").addEventListener("click", () => cambiarMes(1));
    document.getElementById("cal-hoy-btn").addEventListener("click", () => {
        mesCalendario = new Date(); mesCalendario.setDate(1);
        pintarCalendario();
    });
    cont.querySelectorAll(".cal-day:not(.otro-mes):not(.cerrado)").forEach(celda => {
        celda.addEventListener("click", () => {
            diaSeleccionado = new Date(celda.dataset.fecha);
            horaSeleccionada = null;
            pintarCalendario();
            pintarHorarios();
        });
    });
}

function cambiarMes(delta) {
    mesCalendario.setMonth(mesCalendario.getMonth() + delta);
    pintarCalendario();
}

// Nivel de ocupación del día para el empleado seleccionado, para el puntito del calendario.
function nivelOcupacionDia(fecha, empleadoId) {
    const dow = fecha.getDay();
    const horario = HORARIO_ATENCION[dow];
    if (!horario) return "completo";

    const totalSlots = slotsDelDia(horario).length;
    const turnosDia = todosLosTurnos.filter(t =>
        Number(t.empleado_id) === empleadoId
        && t.estado !== "cancelado"
        && new Date(t.fecha).toDateString() === fecha.toDateString()
    );

    if (turnosDia.length === 0) return "disponible";
    const ocupacion = turnosDia.length / totalSlots;
    return ocupacion >= 0.75 ? "completo" : "pocos";
}

/* ============================================================
   Grilla de horarios
============================================================ */
function slotsDelDia(horario) {
    const slots = [];
    let [h, m] = horario.inicio.split(":").map(Number);
    const [hFin, mFin] = horario.fin.split(":").map(Number);
    const finMin = hFin * 60 + mFin;

    while (h * 60 + m < finMin) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        m += PASO_MIN;
        if (m >= 60) { m -= 60; h += 1; }
    }
    return slots;
}

function pintarHorarios() {
    const cont = document.getElementById("horario-contenido");
    const vrCard = document.getElementById("vista-rapida-card");

    if (!servicioSeleccionado || !empleadoSeleccionado || !diaSeleccionado) {
        cont.innerHTML = `<p class="sin-seleccion">Elegí servicio, empleado y un día en el calendario para ver los horarios disponibles.</p>`;
        vrCard.style.display = "none";
        return;
    }

    const dow = diaSeleccionado.getDay();
    const horario = HORARIO_ATENCION[dow];
    if (!horario) {
        cont.innerHTML = `<p class="sin-seleccion">El negocio no atiende ese día.</p>`;
        vrCard.style.display = "none";
        return;
    }

    const servicio = serviciosPorId[servicioSeleccionado];
    const duracion = Number(servicio.duracion) || PASO_MIN;
    const finMin = horaAMin(horario.fin);

    const turnosEmpleadoDia = todosLosTurnos.filter(t =>
        Number(t.empleado_id) === empleadoSeleccionado
        && t.estado !== "cancelado"
        && new Date(t.fecha).toDateString() === diaSeleccionado.toDateString()
    ).map(t => {
        const inicio = new Date(t.fecha);
        const inicioMin = inicio.getHours() * 60 + inicio.getMinutes();
        const dur = Number(serviciosPorId[t.servicio_id]?.duracion) || PASO_MIN;
        return { inicioMin, finMin: inicioMin + dur };
    });

    const slots = slotsDelDia(horario).map(hora => {
        const inicioMin = horaAMin(hora);
        const propioFin = inicioMin + duracion;

        // No entra completo antes del cierre.
        if (propioFin > finMin) return { hora, estado: "cerrado" };

        // Se solapa con algún turno existente de ese empleado ese día.
        const ocupado = turnosEmpleadoDia.some(t => inicioMin < t.finMin && propioFin > t.inicioMin);

        return { hora, estado: ocupado ? "ocupado" : "disponible" };
    }).filter(s => s.estado !== "cerrado");

    const grupos = {
        "Mañana": slots.filter(s => horaAMin(s.hora) < horaAMin("13:00")),
        "Tarde": slots.filter(s => horaAMin(s.hora) >= horaAMin("13:00") && horaAMin(s.hora) < horaAMin("19:00")),
        "Noche": slots.filter(s => horaAMin(s.hora) >= horaAMin("19:00")),
    };

    let html = "";
    for (const [nombreGrupo, lista] of Object.entries(grupos)) {
        if (lista.length === 0) continue;
        html += `<div class="horario-grupo-titulo">${nombreGrupo}</div><div class="horario-grid">`;
        html += lista.map(s => {
            let clase = s.estado;
            if (s.hora === horaSeleccionada) clase = "seleccionado";
            const disabled = s.estado === "ocupado" ? "disabled" : "";
            return `<button type="button" class="horario-slot ${clase}" data-hora="${s.hora}" ${disabled}>${s.hora}</button>`;
        }).join("");
        html += `</div>`;
    }

    if (slots.every(s => s.estado === "ocupado")) {
        html += `<p class="sin-seleccion">No quedan horarios disponibles para este empleado y servicio ese día.</p>`;
    }

    if (horaSeleccionada) {
        const finHora = minAHora(horaAMin(horaSeleccionada) + duracion);
        html += `<div class="horario-nota-seleccion">Turno de ${duracion} min: ${horaSeleccionada} a ${finHora}</div>`;
    }

    cont.innerHTML = html;

    cont.querySelectorAll(".horario-slot.disponible, .horario-slot.seleccionado").forEach(btn => {
        btn.addEventListener("click", () => {
            horaSeleccionada = btn.dataset.hora;
            const fechaISO = new Date(diaSeleccionado);
            const [h, m] = horaSeleccionada.split(":").map(Number);
            fechaISO.setHours(h, m, 0, 0);
            document.getElementById("turno-fecha").value = fechaISO.toISOString();
            pintarHorarios();
        });
    });

    pintarVistaRapida(turnosEmpleadoDia.length, slotsDelDia(horario).length);
}

function pintarVistaRapida(turnosDelDia, totalSlots) {
    const vrCard = document.getElementById("vista-rapida-card");
    vrCard.style.display = "";
    document.getElementById("vr-dia").textContent = diaSeleccionado.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    document.getElementById("vr-turnos").textContent = turnosDelDia;
    const pct = totalSlots ? Math.round((turnosDelDia / totalSlots) * 100) : 0;
    document.getElementById("vr-ocupacion").textContent = `${pct}%`;
    document.getElementById("vr-barra").style.width = `${pct}%`;
}

function horaAMin(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function minAHora(totalMin) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/* ============================================================
   Alta de turno
============================================================ */
async function onCrearTurno(ev) {
    ev.preventDefault();

    const datos = {
        cliente_id: Number(document.getElementById("turno-cliente").value),
        empleado_id: Number(document.getElementById("turno-empleado").value),
        servicio_id: Number(document.getElementById("turno-servicio").value),
        fecha: document.getElementById("turno-fecha").value,
    };

    if (!datos.cliente_id || !datos.empleado_id || !datos.servicio_id || !datos.fecha) {
        alert("Completá cliente, servicio, empleado y elegí un horario en la grilla.");
        return;
    }

    try {
        const response = await postDatos(API_TURNOS, datos);

        if (response.status === 409) {
            const data = await response.json();
            alert(data.message || "Ese empleado ya tiene un turno en ese horario.");
            return;
        }
        if (!response.ok) throw new Error("Error al crear turno");

        document.getElementById("form-turno").reset();
        document.getElementById("empleado-selector").querySelectorAll(".empleado-chip").forEach(c => c.classList.remove("seleccionado"));
        empleadoSeleccionado = null;
        servicioSeleccionado = null;
        diaSeleccionado = null;
        horaSeleccionada = null;
        await cargarDatos();

    } catch (err) {
        console.error(err);
        alert("No se pudo crear el turno.");
    }
}

/* ============================================================
   Tabla de turnos registrados
============================================================ */
function renderizarTabla() {
    const texto = document.getElementById("buscar-turno").value.trim().toLowerCase();
    const estadoFiltro = document.getElementById("filtro-estado-turno").value;

    const filtrados = todosLosTurnos
        .filter(t => !estadoFiltro || t.estado === estadoFiltro)
        .filter(t => !texto || coincideTexto(t, texto))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const tabla = document.getElementById("tabla-turnos");
    const vacio = document.getElementById("turnos-vacio");

    if (filtrados.length === 0) {
        tabla.innerHTML = "";
        vacio.style.display = "";
        return;
    }
    vacio.style.display = "none";

    tabla.innerHTML = filtrados.map(t => filaTurno(t)).join("");

    tabla.querySelectorAll("select.select-estado").forEach(sel => {
        sel.addEventListener("change", onCambiarEstado);
    });
    // "Eliminar" cancela el turno (baja lógica), no lo borra — backlog Escenario 28.
    tabla.querySelectorAll("button.btn-cancelar-turno").forEach(btn => {
        btn.addEventListener("click", onCancelarTurno);
    });
}

function coincideTexto(t, texto) {
    const cliente = clientesPorId[t.cliente_id]?.nombre?.toLowerCase() || "";
    const empleado = empleadosPorId[t.empleado_id]?.nombre?.toLowerCase() || "";
    const servicio = serviciosPorId[t.servicio_id]?.nombre?.toLowerCase() || "";
    return cliente.includes(texto) || empleado.includes(texto) || servicio.includes(texto);
}

function filaTurno(t) {
    const servicio = serviciosPorId[t.servicio_id];
    const empleado = empleadosPorId[t.empleado_id];
    const cliente = clientesPorId[t.cliente_id];
    const yaCancelado = t.estado === "cancelado";

    return `
    <tr data-id="${t.id_turnos}">
        <td>${formatoFechaCorta(t.fecha)}</td>
        <td>${formatoHora(t.fecha)}</td>
        <td>${cliente ? cliente.nombre : "Cliente sin datos"}</td>
        <td>${empleado ? empleado.nombre : "Empleado sin datos"}</td>
        <td>${servicio ? servicio.nombre : "Servicio sin datos"}</td>
        <td>${servicio ? formatoMoneda(servicio.precio) : "-"}</td>
        <td>
            <select class="select-estado" data-id="${t.id_turnos}">
                ${ESTADOS.map(e => `<option value="${e}" ${e === t.estado ? "selected" : ""}>${capitalizar(e)}</option>`).join("")}
            </select>
        </td>
        <td class="tabla-acciones">
            <button type="button" class="btn-icon danger btn-cancelar-turno" data-id="${t.id_turnos}"
                title="Cancelar turno" ${yaCancelado ? "disabled" : ""}>✕</button>
        </td>
    </tr>`;
}

async function onCambiarEstado(ev) {
    const id = ev.target.dataset.id;
    const nuevoEstado = ev.target.value;
    try {
        await cambiarEstadoTurno(id, nuevoEstado);
        const turno = todosLosTurnos.find(t => String(t.id_turnos) === String(id));
        if (turno) turno.estado = nuevoEstado;
        renderizarTabla();
    } catch (err) {
        console.error(err);
        alert("No se pudo actualizar el estado del turno.");
        renderizarTabla();
    }
}

async function onCancelarTurno(ev) {
    const id = ev.currentTarget.dataset.id;
    if (!confirm("¿Cancelar este turno? El registro queda en el historial, solo cambia su estado a \"cancelado\".")) return;
    try {
        await cambiarEstadoTurno(id, "cancelado");
        const turno = todosLosTurnos.find(t => String(t.id_turnos) === String(id));
        if (turno) turno.estado = "cancelado";
        renderizarTabla();
    } catch (err) {
        console.error(err);
        alert("No se pudo cancelar el turno.");
    }
}
