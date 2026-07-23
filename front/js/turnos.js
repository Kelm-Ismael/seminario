const API = "http://localhost:3000/turnos";

const listaTurnos = document.getElementById("listaTurnos");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formTurno");
const btnVolver = document.getElementById("btnVolver");

btnVolver.addEventListener("click", () => {
    window.location.href = "../index.html";
});

formulario.addEventListener("submit", crearTurno);

async function crearTurno(e) {

    e.preventDefault();

    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const servicio = document.getElementById("servicio").value;

    if (!fecha || !hora) {
        alert("Fecha y hora obligatorias");
        return;
    }

    const turno = {

        cliente_id: 1,
        empleado_id: 1,
        servicio_id: Number(servicio),
        fecha: `${fecha} ${hora}`

    };

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(turno)

        });

        if (!response.ok) {
            throw new Error("Error al crear el turno");
        }

        const nuevoTurno = await response.json();

        console.log("Turno creado:", nuevoTurno);

        alert("Turno creado correctamente");

        formulario.reset();

        // Recargar la lista
        obtenerTurnos();

    } catch (error) {

        console.error(error);

        alert("No se pudo crear el turno");

    }


}

// Cargar turnos al abrir la página
document.addEventListener("DOMContentLoaded", obtenerTurnos);

async function obtenerTurnos() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Error al obtener los turnos");
        }

        const turnos = await response.json();

        mostrarTurnos(turnos);

    } catch (error) {

        console.error(error);

        mensaje.textContent = "Error al cargar los turnos.";

    }

}

function mostrarTurnos(turnos) {

    listaTurnos.innerHTML = "";

    if (turnos.length === 0) {

        mensaje.style.display = "block";

        return;

    }

    mensaje.style.display = "none";

    turnos.forEach(turno => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${new Date(turno.fecha).toLocaleString()}</strong>
            - ${turno.servicio_nombre}
            - ${turno.estado}
        `;

        listaTurnos.appendChild(li);

    });

}

