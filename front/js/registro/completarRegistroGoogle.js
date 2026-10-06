// Archivo NUEVO — paso 2 del registro con Google: pide celular y fecha de
// nacimiento (Google no los provee, y `clientes` los exige) y termina de
// crear la cuenta. Llega acá después de completar-registro-google.html
// haber guardado el perfil verificado en sessionStorage (ver googleAuth.js).
import { postDatos } from "../core/api.js";
import { API_REGISTRO_GOOGLE } from "../core/config.js";

const formulario = document.getElementById("formCompletarGoogle");
const mensaje = document.getElementById("mensaje");
const inputCelular = document.getElementById("celular");

const perfilGuardado = sessionStorage.getItem("perfilGoogleRegistro");

if (!perfilGuardado) {
    // Llegaron directo a esta pantalla sin pasar por Google: no hay nada
    // guardado para completar.
    window.location.href = "registro.html";
} else {
    const perfil = JSON.parse(perfilGuardado);
    document.getElementById("nombre").value = perfil.nombre || "";
    document.getElementById("apellido").value = perfil.apellido || "";
    document.getElementById("email").value = perfil.email || "";
}

inputCelular.addEventListener("input", () => {
    inputCelular.value = inputCelular.value.replace(/\D/g, "");
});

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    mensaje.textContent = "";
    mensaje.className = "mensaje";

    const perfil = JSON.parse(sessionStorage.getItem("perfilGoogleRegistro") || "{}");

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const celular = "+54" + inputCelular.value.trim();

    const datos = {
        googleId: perfil.googleId,
        email: perfil.email,
        nombre,
        apellido,
        fecha_nacimiento,
        celular
    };

    const botonSubmit = formulario.querySelector("button[type=submit]");
    botonSubmit.disabled = true;

    try {
        const respuesta = await postDatos(API_REGISTRO_GOOGLE, datos);
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = cuerpo.message || "No se pudo completar el registro.";
            mensaje.classList.add("error");
            return;
        }

        sessionStorage.removeItem("perfilGoogleRegistro");
        mensaje.textContent = cuerpo.mensaje || "Cuenta creada correctamente.";
        mensaje.classList.add("exito");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor. Intentá de nuevo.";
        mensaje.classList.add("error");
    } finally {
        botonSubmit.disabled = false;
    }
});
