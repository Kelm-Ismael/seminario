import { getDatos } from "../core/api.js";
import {
    API_CLIENTES,
    API_EMPLEADOS,
    API_SERVICIOS
} from "../core/config.js";

const selectCliente = document.getElementById("cliente");
const selectEmpleado = document.getElementById("empleado");
const selectServicio = document.getElementById("servicio");

export async function cargarClientes() {

    try {

        const clientes = await getDatos(API_CLIENTES);

        llenarSelect(
            selectCliente,
            clientes,
            "id_clientes",
            "nombre",
            "Seleccioná un cliente"
        );

    } catch (error) {

        console.error(error);

        selectCliente.innerHTML =
            `<option value="">Error al cargar clientes</option>`;

    }

}

export async function cargarEmpleados() {

    try {

        const empleados = await getDatos(API_EMPLEADOS);

        llenarSelect(
            selectEmpleado,
            empleados,
            "id_empleados",
            "nombre",
            "Seleccioná un empleado"
        );

    } catch (error) {

        console.error(error);

        selectEmpleado.innerHTML =
            `<option value="">Error al cargar empleados</option>`;

    }

}

export async function cargarServicios() {

    try {

        const servicios = await getDatos(API_SERVICIOS);

        llenarSelectServicios(servicios);

    } catch (error) {

        console.error(error);

        selectServicio.innerHTML =
            `<option value="">Error al cargar servicios</option>`;

    }

}

function llenarSelect(select, items, valueKey, labelKey, placeholder) {

    select.innerHTML = `<option value="">${placeholder}</option>`;

    items.forEach(item => {

        const option = document.createElement("option");

        option.value = item[valueKey];

        option.textContent = item[labelKey];

        select.appendChild(option);

    });

}

function llenarSelectServicios(servicios) {

    selectServicio.innerHTML =
        `<option value="">Seleccioná un servicio</option>`;

    servicios.forEach(servicio => {

        const option = document.createElement("option");

        option.value = servicio.id_servicios;

        option.textContent =
            `${servicio.nombre} - $${servicio.precio}`;

        selectServicio.appendChild(option);

    });

}