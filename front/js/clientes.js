// Importa la función que obtiene los clientes desde la API
import { obtenerClientes } from "./api.js";

// Carga y muestra los clientes en la tabla
async function mostrarClientes() {

    try {

        // Obtiene los clientes del backend
        const clientes = await obtenerClientes();

        // Obtiene el tbody de la tabla
        const tbody = document.getElementById("tabla-clientes");

        // Limpia la tabla
        tbody.innerHTML = "";

        // Recorre los clientes y crea las filas
        clientes.forEach(cliente => {

            tbody.innerHTML += `
                <tr>
                    <td>${cliente.id_clientes}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.email}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Error al mostrar clientes:", error);

    }

}

// Ejecuta cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarClientes();
});