// js/reservar-turno.js
// Lógica de selección/reserva para el panel cliente, siguiendo el mismo
// patrón que paneles/administrativo/js/turnos/turnos.js (getDatos + config
// centralizada de endpoints).
//
// SUPUESTOS a verificar contra tu core/config.js real:
//   - API_SERVICIOS: endpoint GET que devuelve [{ id_servicios, nombre, precio }]
//   - API_EMPLEADOS: endpoint GET que devuelve [{ id_empleados, nombre, rol }]
//   - API_TURNOS:    endpoint POST para crear un turno
// Si los nombres de campo difieren (por ej. "precio" vs "costo"), ajustá
// las referencias marcadas más abajo.

import { getDatos } from "../core/api.js";
import { API_SERVICIOS, API_EMPLEADOS, API_TURNOS } from "../core/config.js";

const seleccion = {
    servicio: null,
    profesional: null,
    fecha: null,
    hora: null
};

const contenedorServicios = document.getElementById("serviciosContainer");
const contenedorProfesionales = document.getElementById("profesionalesContainer");
const calendarioGrid = document.getElementById("calendarioGrid");
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

        seleccion.fecha = dia.textContent.trim();

        actualizarResumen();

    });

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

function actualizarResumen() {

    if (resumenServicio) {
        resumenServicio.textContent = seleccion.servicio?.nombre || "-";
    }

    if (resumenProfesional) {
        resumenProfesional.textContent = seleccion.profesional?.nombre || "-";
    }

    if (resumenFecha) {
        resumenFecha.textContent = seleccion.fecha || "-";
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
        servicio_id: Number(seleccion.servicio.id),
        empleado_id: Number(seleccion.profesional.id),
        fecha: seleccion.fecha,
        hora: seleccion.hora
        // TODO: sumar cliente_id del usuario logueado cuando haya sesión conectada
    };

    try {

        // TODO: si core/api.js ya tiene un helper de POST (ej. postDatos),
        // reemplazar este fetch por esa función para mantener el mismo patrón.
        const respuesta = await fetch(API_TURNOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo crear el turno");
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
            mensajeReserva.textContent = "Ocurrió un error al reservar el turno. Intentá nuevamente.";
        }

    }

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