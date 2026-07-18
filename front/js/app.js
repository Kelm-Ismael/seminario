// js/app.js

import { mostrarClientes } from "./clientes.js";

document.addEventListener("DOMContentLoaded", () => {
    mostrarClientes();
});

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

// async function loadComponent(id, file){

//     const response = await fetch(file);

//     const html = await response.text();

//     document.getElementById(id).innerHTML = html;

// }


// loadComponent("navbar","components/layout/navbar.html");

// loadComponent("hero","components/home/hero.html");

// loadComponent("features","components/home/features.html");

// loadComponent("services","components/home/services.html");

// loadComponent("about","components/home/about.html");

// loadComponent("testimonials","components/home/testimonials.html");

// loadComponent("booking","components/home/booking.html");

// loadComponent("footer","components/layout/footer.html");