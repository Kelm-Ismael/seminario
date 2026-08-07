// export async function getDatos(url) {
//     const response = await fetch(url);

//     if (!response.ok) {
//         throw new Error("Error en la petición");
//     }

//     return response.json();
// }

// export async function postDatos(url, datos) {
//     const response = await fetch(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(datos)
//     });

//     return response;
// }

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

// NUEVO: actualizar un recurso existente (ej: cambiar estado de un turno,
// editar un servicio o un empleado). Mismo estilo que postDatos: devuelve
// la respuesta cruda (sin .json()) para que cada pantalla decida cómo
// manejar errores/status, igual que ya hacían con postDatos.
export async function putDatos(url, datos) {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    return response;
}

// NUEVO: eliminar un recurso (ej: borrar un turno cargado por error,
// un servicio o un empleado dado de baja).
export async function deleteDatos(url) {
    const response = await fetch(url, {
        method: "DELETE"
    });

    return response;
}