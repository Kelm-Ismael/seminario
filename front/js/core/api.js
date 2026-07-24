export async function getDatos(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error en la petición");
    }

    return response.json();
}

export async function postDatos(url, datos) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    return response;
}