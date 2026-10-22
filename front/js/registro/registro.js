// Archivo NUEVO — lógica de la pantalla "Crear cuenta" (registro.html)
import { postDatos } from "../core/api.js";
import { API_REGISTRO } from "../core/config.js";

const formulario = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");
const inputCelular = document.getElementById("celular");
const togglePassword = document.getElementById("togglePassword");
const inputPassword = document.getElementById("password");
const checkTerminos = document.getElementById("aceptaTerminos");

togglePassword.addEventListener("click", () => {
    const esPassword = inputPassword.type === "password";
    inputPassword.type = esPassword ? "text" : "password";
    togglePassword.textContent = esPassword ? "🙈" : "👁️";
});

// Celular en formato internacional: un "+" al inicio y después solo dígitos
// (cualquier país). Se quitan espacios, guiones y letras mientras se escribe.
inputCelular.addEventListener("input", () => {
    const soloDigitos = inputCelular.value.replace(/\D/g, "");
    inputCelular.value = "+" + soloDigitos;
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
    const celular = inputCelular.value.trim();
    const acepta_terminos = checkTerminos.checked;

    if (!acepta_terminos) {
        mensaje.textContent = "Tenés que aceptar los Términos y Condiciones y la Política de Privacidad.";
        mensaje.classList.add("error");
        return;
    }

    const datos = { email, password, nombre, apellido, fecha_nacimiento, celular, acepta_terminos };

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
