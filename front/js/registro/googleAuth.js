// Archivo NUEVO — login/registro con Google en la pantalla "Crear cuenta".
// Google Identity Services (biblioteca oficial, cargada en registro.html)
// nos da un idToken firmado por Google; se lo mandamos al backend, que lo
// verifica y nos dice si ya existe cuenta o si hay que completar el
// registro (celular + fecha de nacimiento, que Google no provee).
//
// Alcance acordado: esto SOLO cubre cuentas nuevas. Si el backend dice que
// ya existe una cuenta con ese email/Google ID, se muestra el mensaje de
// error y no se deja entrar (eso ya sería el caso de uso "Iniciar sesión",
// que sigue en pausa).
import { postDatos } from "../core/api.js";
import { API_REGISTRO_GOOGLE_VERIFICAR, GOOGLE_CLIENT_ID } from "../core/config.js";

const mensaje = document.getElementById("mensaje");
const contenedorBotonGoogle = document.getElementById("googleBtnContainer");

const manejarRespuestaGoogle = async (respuestaGoogle) => {
    if (mensaje) {
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }

    try {
        const respuesta = await postDatos(API_REGISTRO_GOOGLE_VERIFICAR, {
            idToken: respuestaGoogle.credential
        });
        const cuerpo = await respuesta.json();

        if (!respuesta.ok) {
            if (mensaje) {
                mensaje.textContent = cuerpo.message || "No se pudo continuar con Google.";
                mensaje.classList.add("error");
            }
            return;
        }

        // Cuenta nueva: guardamos el perfil verificado y vamos a pedir
        // celular + fecha de nacimiento antes de terminar el registro.
        sessionStorage.setItem("perfilGoogleRegistro", JSON.stringify(cuerpo.perfil));
        window.location.href = "completar-registro-google.html";

    } catch (error) {
        console.error(error);
        if (mensaje) {
            mensaje.textContent = "No se pudo conectar con el servidor. Intentá de nuevo.";
            mensaje.classList.add("error");
        }
    }
};

window.addEventListener("load", () => {
    if (!GOOGLE_CLIENT_ID) {
        console.warn(
            "Falta completar GOOGLE_CLIENT_ID en js/core/config.js — el botón de Google todavía no va a funcionar."
        );
        return;
    }

    if (!window.google || !contenedorBotonGoogle) {
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: manejarRespuestaGoogle
    });

    google.accounts.id.renderButton(contenedorBotonGoogle, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: 320
    });
});
