// js/reservar-turno.js
// Lógica de selección/reserva para el panel cliente, siguiendo el mismo
// patrón que paneles/administrativo/js/turnos/turnos.js (getDatos/postDatos
// de core/api.js + endpoints de core/config.js).
//
// SUPUESTOS a verificar contra tu backend real:
//   - API_SERVICIOS: GET -> [{ id_servicios, nombre, precio }]
//   - API_EMPLEADOS: GET -> [{ id_empleados, nombre, rol }]
//   - API_TURNOS:    POST -> { cliente_id, empleado_id, servicio_id, fecha }
//     con "fecha" en formato "YYYY-MM-DDTHH:mm" (mismo formato que usa
//     el datetime-local del modal de edición en turnos.js).
//   - cliente_id está hardcodeado en 1 hasta que haya sesión de cliente
//     conectada (ver TODO en crearTurnoCliente).

import { getDatos, postDatos } from "../core/api.js";
import { API_SERVICIOS, API_EMPLEADOS, API_TURNOS } from "../core/config.js";

const MESES = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
};

const seleccion = {
    servicio: null,
    profesional: null,
    fecha: null,
    hora: null
};

const contenedorServicios = document.getElementById("serviciosContainer");
const contenedorProfesionales = document.getElementById("profesionalesContainer");
const calendarioGrid = document.getElementById("calendarioGrid");
const calendarioMesAno = document.getElementById("calendarioMesAno");
const timeSlotsContainer = document.getElementById("timeSlotsContainer");

const resumenServicio = document.getElementById("resumenServicio");
const resumenProfesional = document.getElementById("resumenProfesional");
const resumenFecha = document.getElementById("resumenFecha");
const resumenHora = document.getElementById("resumenHora");
const resumenPrecio = document.getElementById("resumenPrecio");

const btnContinuar = document.getElementById("btnContinuar");
const mensajeReserva = document.getElementById("mensajeReserva");



// ==========================================================
// SERVICIOS
// ==========================================================

async function cargarServicios() {

    if (!contenedorServicios) return;

    try {

        const servicios = await getDatos(API_SERVICIOS);

        contenedorServicios.innerHTML = "";

        servicios.forEach((serv, index) => {

            const card = document.createElement("div");

            card.className = "service-card";
            card.dataset.id = serv.id_servicios;
            card.dataset.nombre = serv.nombre;
            card.dataset.precio = serv.precio;

            card.innerHTML = `
                <div class="icon">✂️</div>
                <h4>${serv.nombre}</h4>
                <p>Desde $${Number(serv.precio).toLocaleString("es-AR")}</p>
            `;

            card.addEventListener("click", () => seleccionarServicio(card));

            contenedorServicios.appendChild(card);

            if (index === 0) seleccionarServicio(card);

        });

    } catch (error) {

        console.error(error);
        contenedorServicios.innerHTML = `<p class="mensaje">No se pudieron cargar los servicios</p>`;

    }

}


function seleccionarServicio(card) {

    document
        .querySelectorAll(".service-card")
        .forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");

    seleccion.servicio = {
        id: card.dataset.id,
        nombre: card.dataset.nombre,
        precio: card.dataset.precio
    };

    actualizarResumen();

}



// ==========================================================
// PROFESIONALES
// ==========================================================

async function cargarProfesionales() {

    if (!contenedorProfesionales) return;

    try {

        const empleados = await getDatos(API_EMPLEADOS);

        contenedorProfesionales.innerHTML = "";

        empleados.forEach((emp, index) => {

            const card = document.createElement("div");

            card.className = "professional-card";
            card.dataset.id = emp.id_empleados;
            card.dataset.nombre = emp.nombre;

            const iniciales = emp.nombre
                .split(" ")
                .map(parte => parte[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

            card.innerHTML = `
                <div class="avatar-initials avatar-sm">${iniciales}</div>
                <h4>${emp.nombre}</h4>
                <p>${emp.rol || "Estilista"}</p>
            `;

            card.addEventListener("click", () => seleccionarProfesional(card));

            contenedorProfesionales.appendChild(card);

            if (index === 0) seleccionarProfesional(card);

        });

    } catch (error) {

        console.error(error);
        contenedorProfesionales.innerHTML = `<p class="mensaje">No se pudieron cargar los profesionales</p>`;

    }

}


function seleccionarProfesional(card) {

    document
        .querySelectorAll(".professional-card")
        .forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");

    seleccion.profesional = {
        id: card.dataset.id,
        nombre: card.dataset.nombre
    };

    actualizarResumen();

}



// ==========================================================
// CALENDARIO Y HORARIOS
// (delegación de eventos, igual que turnos.js con .estado/.editar/.cancelar)
// ==========================================================

if (calendarioGrid) {

    calendarioGrid.addEventListener("click", (e) => {

        const dia = e.target.closest(".day");

        if (!dia || dia.classList.contains("muted")) return;

        calendarioGrid
            .querySelectorAll(".day")
            .forEach(d => d.classList.remove("selected"));

        dia.classList.add("selected");

        seleccion.fecha = obtenerFechaSeleccionada(dia.textContent.trim());

        actualizarResumen();

    });

}


// Arma un Date a partir del día clickeado + el "Mes Año" del header del calendario
function obtenerFechaSeleccionada(diaTexto) {

    const textoHeader = calendarioMesAno ? calendarioMesAno.textContent.trim() : "";

    const [mesNombre, anioTexto] = textoHeader.split(" ");

    const mesIndex = MESES[mesNombre?.toLowerCase()] ?? new Date().getMonth();
    const anio = Number(anioTexto) || new Date().getFullYear();

    return new Date(anio, mesIndex, Number(diaTexto));

}


if (timeSlotsContainer) {

    timeSlotsContainer.addEventListener("click", (e) => {

        const slot = e.target.closest(".time-slot");

        if (!slot) return;

        timeSlotsContainer
            .querySelectorAll(".time-slot")
            .forEach(s => s.classList.remove("selected"));

        slot.classList.add("selected");

        seleccion.hora = slot.textContent.trim();

        actualizarResumen();

    });

}



// ==========================================================
// RESUMEN (se actualiza en vivo con cada selección)
// ==========================================================

// "Sábado 16 de mayo de 2026"
function formatearFechaLarga(fecha) {

    const texto = fecha.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return texto.charAt(0).toUpperCase() + texto.slice(1);

}


function actualizarResumen() {

    if (resumenServicio) {
        resumenServicio.textContent = seleccion.servicio?.nombre || "-";
    }

    if (resumenProfesional) {
        resumenProfesional.textContent = seleccion.profesional?.nombre || "-";
    }

    if (resumenFecha) {

        resumenFecha.textContent = seleccion.fecha
            ? formatearFechaLarga(seleccion.fecha)
            : "-";

    }

    if (resumenHora) {
        resumenHora.textContent = seleccion.hora || "-";
    }

    if (resumenPrecio) {

        resumenPrecio.textContent = seleccion.servicio?.precio
            ? `$${Number(seleccion.servicio.precio).toLocaleString("es-AR")}`
            : "-";

    }

}



// ==========================================================
// CREAR TURNO (equivalente a crearTurno() de formulario.js,
// pero disparado por "Continuar a confirmación" en vez de un <form>)
// ==========================================================

async function crearTurnoCliente() {

    if (mensajeReserva) mensajeReserva.textContent = "";

    if (
        !seleccion.servicio ||
        !seleccion.profesional ||
        !seleccion.fecha ||
        !seleccion.hora
    ) {

        if (mensajeReserva) {
            mensajeReserva.textContent = "Completá servicio, profesional, fecha y hora antes de continuar.";
        }

        return;

    }

    const datos = {
        // TODO: reemplazar por el id del cliente autenticado cuando haya sesión conectada
        cliente_id: 1,
        empleado_id: Number(seleccion.profesional.id),
        servicio_id: Number(seleccion.servicio.id),
        fecha: combinarFechaYHora(seleccion.fecha, seleccion.hora)
    };

    try {

        const respuesta = await postDatos(API_TURNOS, datos);

        if (!respuesta.ok) {

            // Leemos el cuerpo de la respuesta para saber el motivo real
            // (constraint de FK, campo faltante, etc.) en vez de un 500 mudo.
            let detalle = "";

            try {
                const cuerpo = await respuesta.clone().json();
                detalle = cuerpo?.message || cuerpo?.error || JSON.stringify(cuerpo);
            } catch {
                detalle = await respuesta.text();
            }

            console.error(`Error ${respuesta.status} al crear turno:`, detalle);

            throw new Error(detalle || `Error ${respuesta.status} al crear el turno`);

        }

        if (mensajeReserva) {
            mensajeReserva.textContent = "¡Turno reservado con éxito! Redirigiendo...";
        }

        setTimeout(() => {
            window.location.href = "mis-turnos.html";
        }, 1200);

    } catch (error) {

        console.error(error);

        if (mensajeReserva) {
            mensajeReserva.textContent = error.message || "Ocurrió un error al reservar el turno. Intentá nuevamente.";
        }

    }

}


// Combina el Date (día) + la hora tipo "10:00 AM" en formato "YYYY-MM-DDTHH:mm",
// igual al que arma editarFecha en el modal de turnos.js
function combinarFechaYHora(fecha, horaTexto) {

    const [horaMin, periodo] = horaTexto.split(" ");
    let [horas, minutos] = horaMin.split(":").map(Number);

    if (periodo === "PM" && horas !== 12) horas += 12;
    if (periodo === "AM" && horas === 12) horas = 0;

    const combinada = new Date(fecha);
    combinada.setHours(horas, minutos, 0, 0);

    const pad = (n) => String(n).padStart(2, "0");

    return (
        `${combinada.getFullYear()}-${pad(combinada.getMonth() + 1)}-${pad(combinada.getDate())}` +
        `T${pad(combinada.getHours())}:${pad(combinada.getMinutes())}`
    );

}


if (btnContinuar) {
    btnContinuar.addEventListener("click", crearTurnoCliente);
}



// ==========================================================
// INICIO
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    cargarServicios();
    cargarProfesionales();

});