// js/app.js


async function cargarComponente(id, archivo) {
    const respuesta = await fetch(`components/${archivo}`);
    const html = await respuesta.text();
    document.getElementById(id).innerHTML = html;
}

window.addEventListener("DOMContentLoaded", () => {
    cargarComponente("header", "header.html");
    cargarComponente("navbar", "navbar.html");
    cargarComponente("footer", "footer.html");
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const clientes = await obtenerClientes();

        const tbody = document.getElementById("tabla-clientes");

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
        console.error(error);
    }
});