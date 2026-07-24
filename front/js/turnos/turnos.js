import { cargarClientes, cargarEmpleados, cargarServicios } from "./selects.js";
import { obtenerTurnos } from "./listado.js";
import { crearTurno } from "./formulario.js";
import { cancelarTurno } from "./cancelar.js";
import { cambiarEstadoTurno } from "./estado.js";
import { filtrarTurnos } from "./filtros.js";


const formulario = document.getElementById("formTurno");
const btnVolver = document.getElementById("btnVolver");

const busqueda = document.getElementById("busqueda");
const filtroEstado = document.getElementById("filtroEstado");

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



// Acciones cancelar
document.addEventListener(
    "click",
    async (e) => {


        if (
            e.target.classList.contains("cancelar")
        ) {

            const id =
                e.target.dataset.id;


            await cancelarTurno(id);


            cargarTurnos();

        }


    }
);



// Cambio de estado
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

        cargarClientes();

        cargarEmpleados();

        cargarServicios();

        cargarTurnos();

    }
);