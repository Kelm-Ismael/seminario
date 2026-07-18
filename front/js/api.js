async function obtenerClientes() {

    const response = await fetch(`${CONFIG.API_URL}/cliente/clientes`);

    if (!response.ok) {
        throw new Error("Error al obtener clientes");
    }

    const clientes = await response.json();

    const tbody = document.getElementById("tabla-clientes");

    tbody.innerHTML = "";

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

}

document.addEventListener("DOMContentLoaded", obtenerClientes);