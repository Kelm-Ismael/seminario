
async function obtenerClientes() {
    const response = await fetch(`${CONFIG.API_URL}/cliente/clientes`);

    if (!response.ok) {
        throw new Error("Error al obtener clientes");
    }

    return await response.json();
}