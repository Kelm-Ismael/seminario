import { cargarClientes, cargarEmpleados, cargarServicios } from "./selects.js";
import { obtenerTurnos } from "./listado.js";
import { crearTurno } from "./formulario.js";
import { cancelarTurno } from "./cancelar.js";
import { cambiarEstadoTurno } from "./estado.js";
import { editarTurno } from "./editar.js";
import { filtrarTurnos } from "./filtros.js";
import { getDatos } from "../core/api.js";
import { API_EMPLEADOS } from "../core/config.js";


const formulario = document.getElementById("formTurno");
const btnVolver = document.getElementById("btnVolver");

const busqueda = document.getElementById("busqueda");
const filtroEstado = document.getElementById("filtroEstado");

// Modal de edición
const modalEditar = document.getElementById("modalEditar");
const editarId = document.getElementById("editarId");
const editarEmpleado = document.getElementById("editarEmpleado");
const editarFecha = document.getElementById("editarFecha");
const editarEstado = document.getElementById("editarEstado");
const guardarEdicion = document.getElementById("guardarEdicion");
const cerrarModal = document.getElementById("cerrarModal");

let turnosActuales = [];



// Volver
if (btnVolver) {

    btnVolver.addEventListener("click", () => {
        window.location.href = "../index.html";
    });

}



// Crear turno
if (formulario) {

    formulario.addEventListener(
        "submit",
        async (e) => {

            await crearTurno(e);

            cargarTurnos();

        }
    );

}



// Cargar turnos
async function cargarTurnos() {

    turnosActuales = await obtenerTurnos();

    mostrarTurnos(turnosActuales);

}



// Pintar tabla
function mostrarTurnos(turnos) {

    const tabla = document.getElementById("tablaTurnos");

    if (!tabla) return;


    tabla.innerHTML = "";


    turnos.forEach(turno => {

        const fila = document.createElement("tr");


        fila.innerHTML = `

            <td>${turno.id_turnos}</td>

            <td>${turno.cliente_nombre}</td>

            <td>${turno.empleado_nombre}</td>

            <td>${turno.servicio_nombre}</td>

            <td>${turno.fecha}</td>

            <td>

                <select 
                class="estado"
                data-id="${turno.id_turnos}">

                    <option value="pendiente"
                    ${turno.estado === "pendiente" ? "selected" : ""}>
                    pendiente
                    </option>


                    <option value="confirmado"
                    ${turno.estado === "confirmado" ? "selected" : ""}>
                    confirmado
                    </option>


                    <option value="finalizado"
                    ${turno.estado === "finalizado" ? "selected" : ""}>
                    finalizado
                    </option>


                    <option value="cancelado"
                    ${turno.estado === "cancelado" ? "selected" : ""}>
                    cancelado
                    </option>

                </select>

            </td>


            <td>

                <button 
                class="editar"
                data-id="${turno.id_turnos}">
                ✏️
                </button>

                <button 
                class="cancelar"
                data-id="${turno.id_turnos}">
                ❌
                </button>


            </td>

        `;


        tabla.appendChild(fila);

    });

}



// Búsqueda
if (busqueda) {

    busqueda.addEventListener(
        "input",
        () => {

            const resultado = filtrarTurnos(
                turnosActuales,
                busqueda.value
            );


            mostrarTurnos(resultado);

        }
    );

}



// Filtro estado
if (filtroEstado) {

    filtroEstado.addEventListener(
        "change",
        () => {

            let resultado = turnosActuales;


            if (filtroEstado.value) {

                resultado =
                    turnosActuales.filter(
                        t => t.estado === filtroEstado.value
                    );

            }


            mostrarTurnos(resultado);

        }
    );

}



// Carga los empleados dentro del <select> del modal de edición
// y deja preseleccionado el empleado actual del turno.
async function cargarEmpleadosModal(nombreEmpleadoActual) {

    try {

        const empleados = await getDatos(API_EMPLEADOS);

        editarEmpleado.innerHTML = "";

        empleados.forEach(emp => {

            const option = document.createElement("option");

            option.value = emp.id_empleados;
            option.textContent = emp.nombre;

            if (emp.nombre === nombreEmpleadoActual) {
                option.selected = true;
            }

            editarEmpleado.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        editarEmpleado.innerHTML =
            `<option value="">Error al cargar empleados</option>`;

    }

}



// Abre el modal y lo llena con los datos del turno elegido
function abrirModalEditar(turno) {

    editarId.value = turno.id_turnos;
    editarEstado.value = turno.estado;

    // datetime-local necesita formato "YYYY-MM-DDTHH:mm"
    const fecha = new Date(turno.fecha);
    const fechaLocal = new Date(
        fecha.getTime() - fecha.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 16);

    editarFecha.value = fechaLocal;

    cargarEmpleadosModal(turno.empleado_nombre);

    modalEditar.style.display = "flex";

}

function cerrarModalEditar() {
    modalEditar.style.display = "none";
}

if (cerrarModal) {
    cerrarModal.addEventListener("click", cerrarModalEditar);
}

if (guardarEdicion) {

    guardarEdicion.addEventListener("click", async () => {

        const id = editarId.value;

        const datos = {
            empleado_id: Number(editarEmpleado.value),
            fecha: editarFecha.value,
            estado: editarEstado.value
        };

        try {

            await editarTurno(id, datos);

            cerrarModalEditar();

            cargarTurnos();

        } catch (error) {

            console.error(error);

            alert("No se pudo actualizar el turno");

        }

    });

}



// Acciones: cancelar y editar (delegación de eventos sobre la tabla)
document.addEventListener(
    "click",
    async (e) => {

        if (e.target.classList.contains("cancelar")) {

            const id = e.target.dataset.id;

            await cancelarTurno(id);

            cargarTurnos();

        }

        if (e.target.classList.contains("editar")) {

            const id = e.target.dataset.id;

            const turno = turnosActuales.find(
                t => String(t.id_turnos) === String(id)
            );

            if (turno) abrirModalEditar(turno);

        }

    }
);



// Cambio de estado (select inline en la tabla)
document.addEventListener(
    "change",
    async (e) => {


        if (
            e.target.classList.contains("estado")
        ) {


            const id =
                e.target.dataset.id;


            const estado =
                e.target.value;


            await cambiarEstadoTurno(
                id,
                estado
            );


            cargarTurnos();

        }

    }
);



// Inicio
document.addEventListener(
    "DOMContentLoaded",
    () => {

        modalEditar.style.display = "none";

        cargarClientes();

        cargarEmpleados();

        cargarServicios();

        cargarTurnos();

    }
);