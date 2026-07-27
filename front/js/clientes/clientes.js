const API = "https://seminario-pink.vercel.app/clientes/clientes";
//para localhost nomas
// const API = "http://localhost:3000/cliente/clientes";

const tbody = document.getElementById("tabla-clientes");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formCliente");
const btnVolver = document.getElementById("btnVolver");

btnVolver.addEventListener("click", () => {
    window.location.href = "../index.html";
});

formulario.addEventListener("submit", crearCliente);

async function crearCliente(e) {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const created_at = document.getElementById("created_at").value;

    if (!nombre.trim()) {
        alert("El nombre es obligatorio");
        return;
    }

    if (!created_at) {
    alert("La fecha y hora son obligatorias");
    return;
}

    const cliente = {
        nombre,
        telefono,
        email,
        created_at
    };
    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(cliente)

        });

        if (!response.ok) {
            throw new Error("Error al crear el cliente");
        }

        const nuevoCliente = await response.json();

        console.log("Cliente creado:", nuevoCliente);

        alert("Cliente creado correctamente");

        formulario.reset();

        // Recargar la lista
        obtenerClientes();

    } catch (error) {

        console.error(error);

        alert("No se pudo crear el cliente");

    }

}

// Cargar clientes al abrir la página
document.addEventListener("DOMContentLoaded", obtenerClientes);

async function obtenerClientes() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Error al obtener los clientes");
        }

        const clientes = await response.json();

        mostrarClientes(clientes);

    } catch (error) {

        console.error(error);

        mensaje.textContent = "Error al cargar los clientes.";

    }

}

function mostrarClientes(clientes) {

    tbody.innerHTML = "";

    if (clientes.length === 0) {

        mensaje.style.display = "block";

        return;

    }

    mensaje.style.display = "none";

    clientes.forEach(cliente => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${cliente.id_clientes}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.telefono ?? "-"}</td>
            <td>${cliente.email ?? "-"}</td>
            <td>${cliente.created_at ?? "-"}</td>
        `;

        tbody.appendChild(tr);

    });

}