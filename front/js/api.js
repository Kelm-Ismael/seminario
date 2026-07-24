// async function obtenerClientes() {

//     const response = await fetch(`${CONFIG.API_URL}/cliente/clientes`);

//     if (!response.ok) {
//         throw new Error("Error al obtener clientes");
//     }

//     const clientes = await response.json();

//     const tbody = document.getElementById("tabla-clientes");

//     tbody.innerHTML = "";

//     clientes.forEach(cliente => {

//         tbody.innerHTML += `
//             <tr>
//                 <td>${cliente.id_clientes}</td>
//                 <td>${cliente.nombre}</td>
//                 <td>${cliente.telefono}</td>
//                 <td>${cliente.email}</td>
//             </tr>
//         `;

//     });

// }

// document.addEventListener("DOMContentLoaded", obtenerClientes);

import CONFIG from "../config/environment.js";

export async function get(endpoint) {
    const response = await fetch(`${CONFIG.API_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error("Error al obtener datos");
    }

    return await response.json();
}

export async function post(endpoint, data) {
    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al guardar");
    }

    return await response.json();
}

export async function put(endpoint, data) {
    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al actualizar");
    }

    return await response.json();
}

export async function remove(endpoint) {
    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Error al eliminar");
    }

    return await response.json();
}