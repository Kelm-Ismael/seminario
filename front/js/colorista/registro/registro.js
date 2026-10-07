// Archivo NUEVO — lógica de la pantalla "Crear cuenta" (registro.html)
import { postDatos } from "../core/api.js";
import { API_REGISTRO } from "../core/config.js";

const formulario = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");
const inputCelular = document.getElementById("celular");
const togglePassword = document.getElementById("togglePassword");
const inputPassword = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const esPassword = inputPassword.type === "password";
    inputPassword.type = esPassword ? "text" : "password";
    togglePassword.textContent = esPassword ? "🙈" : "👁️";
});

// Solo dígitos en el campo de celular (el +54 ya va fijo delante, ver mockup)
inputCelular.addEventListener("input", () => {
    inputCelular.value = inputCelular.value.replace(/\D/g, "");
});

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    mensaje.textContent = "";
    mensaje.className = "mensaje";

    const email = document.getElementById("email").value.trim();
    const password = inputPassword.value;
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const celular = "+54" + inputCelular.value.trim();

    const datos = { email, password, nombre, apellido, fecha_nacimiento, celular };

    const botonSubmit = formulario.querySelector("button[type=submit]");
    botonSubmit.disabled = true;

    try {
        const respuesta = await postDatos(API_REGISTRO, datos);
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = cuerpo.message || "No se pudo completar el registro.";
            mensaje.classList.add("error");
            return;
        }

        // Se guarda el email para que la pantalla de confirmación sepa a quién verificar
        sessionStorage.setItem("emailVerificacion", email);
        window.location.href = "confirmar-cuenta.html";

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor. Intentá de nuevo.";
        mensaje.classList.add("error");
    } finally {
        botonSubmit.disabled = false;
    }
});
