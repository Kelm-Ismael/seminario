const API_TURNOS = "http://localhost:3000/turnos";
const API_SERVICIOS = "http://localhost:3000/servicios";
const API_EMPLEADOS = "http://localhost:3000/empleados";
const API_CLIENTES = "http://localhost:3000/cliente/clientes";

const listaTurnos = document.getElementById("listaTurnos");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formTurno");
const btnVolver = document.getElementById("btnVolver");

const selectCliente = document.getElementById("cliente");
const selectEmpleado = document.getElementById("empleado");
const selectServicio = document.getElementById("servicio");

btnVolver.addEventListener("click", () => {
    window.location.href = "../index.html";
});

formulario.addEventListener("submit", crearTurno);

// Al cargar la página: traemos los datos reales y los turnos existentes
document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();
    cargarEmpleados();
    cargarServicios();
    obtenerTurnos();
});


// =========================================================
// CARGA DE SELECTS DINÁMICOS
// =========================================================

async function cargarClientes() {

    try {

        const response = await fetch(API_CLIENTES);

        if (!response.ok) {
            throw new Error("Error al obtener clientes");
        }

        const clientes = await response.json();

        llenarSelect(selectCliente, clientes, "id_clientes", "nombre", "Seleccioná un cliente");

    } catch (error) {

        console.error(error);
        selectCliente.innerHTML = `<option value="">Error al cargar clientes</option>`;

    }

}

async function cargarEmpleados() {

    try {

        const response = await fetch(API_EMPLEADOS);

        if (!response.ok) {
            throw new Error("Error al obtener empleados");
        }

        const empleados = await response.json();

        llenarSelect(selectEmpleado, empleados, "id_empleados", "nombre", "Seleccioná un empleado");

    } catch (error) {

        console.error(error);
        selectEmpleado.innerHTML = `<option value="">Error al cargar empleados</option>`;

    }

}

async function cargarServicios() {

    try {

        const response = await fetch(API_SERVICIOS);

        if (!response.ok) {
            throw new Error("Error al obtener servicios");
        }

        const servicios = await response.json();

        llenarSelectServicios(servicios);

    } catch (error) {

        console.error(error);
        selectServicio.innerHTML = `<option value="">Error al cargar servicios</option>`;

    }

}

// Llena un <select> genérico a partir de una lista de objetos
function llenarSelect(select, items, valueKey, labelKey, placeholder) {

    select.innerHTML = `<option value="">${placeholder}</option>`;

    items.forEach(item => {

        const option = document.createElement("option");

        option.value = item[valueKey];
        option.textContent = item[labelKey];

        select.appendChild(option);

    });

}

// Servicios muestra también el precio, así que tiene su propio armado
function llenarSelectServicios(servicios) {

    selectServicio.innerHTML = `<option value="">Seleccioná un servicio</option>`;

    servicios.forEach(servicio => {

        const option = document.createElement("option");

        option.value = servicio.id_servicios;
        option.textContent = `${servicio.nombre} - $${servicio.precio}`;

        selectServicio.appendChild(option);

    });

}


// =========================================================
// CREAR TURNO
// =========================================================

async function crearTurno(e) {

    e.preventDefault();

    const cliente_id = selectCliente.value;
    const empleado_id = selectEmpleado.value;
    const servicio_id = selectServicio.value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!cliente_id || !empleado_id || !servicio_id || !fecha || !hora) {
        alert("Completá todos los campos");
        return;
    }

    const turno = {

        cliente_id: Number(cliente_id),
        empleado_id: Number(empleado_id),
        servicio_id: Number(servicio_id),
        fecha: `${fecha} ${hora}`

    };

    try {

        const response = await fetch(API_TURNOS, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(turno)

        });

        // Choque de horario: el backend devuelve 409 con un mensaje claro
        if (response.status === 409) {
            const data = await response.json();
            alert(data.message);
            return;
        }

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


// =========================================================
// LISTADO DE TURNOS
// =========================================================

async function obtenerTurnos() {

    try {

        const response = await fetch(API_TURNOS);

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

        li.className = "turno-item";

        const fechaFormateada = new Date(turno.fecha).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        li.innerHTML = `
            <div class="turno-info">
                <span class="turno-fecha">${fechaFormateada}</span>
                <span class="turno-detalle">${turno.servicio_nombre} · ${turno.cliente_nombre} · con ${turno.empleado_nombre}</span>
            </div>
            <span class="badge badge-${turno.estado}">${turno.estado}</span>
        `;

        listaTurnos.appendChild(li);

    });

}