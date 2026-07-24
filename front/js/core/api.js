
// import CONFIG from "../config/environment.js";

// export async function get(endpoint) {
//     const response = await fetch(`${CONFIG.API_URL}${endpoint}`);

//     if (!response.ok) {
//         throw new Error("Error al obtener datos");
//     }

//     return await response.json();
// }

// export async function post(endpoint, data) {
//     const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//         throw new Error("Error al guardar");
//     }

//     return await response.json();
// }

// export async function put(endpoint, data) {
//     const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//         throw new Error("Error al actualizar");
//     }

//     return await response.json();
// }

// export async function remove(endpoint) {
//     const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
//         method: "DELETE"
//     });

//     if (!response.ok) {
//         throw new Error("Error al eliminar");
//     }

//     return await response.json();
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