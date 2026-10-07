// Login/registro con Google en la pantalla "Crear cuenta".
// Google Identity Services (biblioteca oficial, cargada en registro.html)
// nos da un idToken firmado por Google; se lo mandamos al backend, que lo
// verifica y nos dice si ya existe cuenta o si hay que completar el
// registro (celular + fecha de nacimiento, que Google no provee).
//
// Alcance acordado: esto SOLO cubre cuentas nuevas. Si el backend dice que
// ya existe una cuenta con ese email/Google ID, se muestra el mensaje de
// error y no se deja entrar.
import { postDatos } from "../core/api.js";
import { API_REGISTRO_GOOGLE_VERIFICAR, GOOGLE_CLIENT_ID } from "../core/config.js";

const mensaje = document.getElementById("mensaje");
const contenedorBotonGoogle = document.getElementById("googleBtnContainer");

const mostrarError = (texto) => {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = "mensaje error";
};

// Si Google no se puede usar, mostramos un botón deshabilitado para que
// el lugar no quede vacío y se entienda qué pasa.
const mostrarBotonDeshabilitado = (motivo) => {
    if (!contenedorBotonGoogle) return;
    contenedorBotonGoogle.innerHTML = `
        <button type="button" class="btn-social" disabled title="${motivo}">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
            </svg>
            Continuar con Google
        </button>`;
};

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
            mostrarError(cuerpo.message || "No se pudo continuar con Google.");
            return;
        }

        // Cuenta nueva: guardamos el perfil verificado y vamos a pedir
        // celular + fecha de nacimiento antes de terminar el registro.
        sessionStorage.setItem("perfilGoogleRegistro", JSON.stringify(cuerpo.perfil));
        window.location.href = "completar-registro-google.html";

    } catch (error) {
        console.error(error);
        mostrarError("No se pudo conectar con el servidor. Intentá de nuevo.");
    }
};

// El script de Google se carga con async, así que puede llegar antes o
// después que este módulo. Esperamos hasta 10 segundos a que esté listo.
const esperarGoogle = (msMaximo = 10000) =>
    new Promise((resolve) => {
        const inicio = Date.now();
        const revisar = () => {
            if (window.google?.accounts?.id) return resolve(true);
            if (Date.now() - inicio > msMaximo) return resolve(false);
            setTimeout(revisar, 100);
        };
        revisar();
    });

// Google acepta anchos de 200 a 400 px. Usamos el ancho real del
// contenedor para que el botón no se corte en celulares.
const anchoBoton = () => {
    const ancho = Math.floor(contenedorBotonGoogle.getBoundingClientRect().width);
    return Math.max(200, Math.min(400, ancho || 320));
};

const dibujarBoton = () => {
    contenedorBotonGoogle.innerHTML = "";
    google.accounts.id.renderButton(contenedorBotonGoogle, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "center",
        width: anchoBoton()
    });
};

const iniciarGoogle = async () => {
    if (!contenedorBotonGoogle) return;

    if (!GOOGLE_CLIENT_ID) {
        console.warn("Falta completar GOOGLE_CLIENT_ID en js/core/config.js — el botón de Google no va a funcionar.");
        mostrarBotonDeshabilitado("Falta configurar GOOGLE_CLIENT_ID");
        return;
    }

    const cargado = await esperarGoogle();
    if (!cargado) {
        console.warn("No se pudo cargar https://accounts.google.com/gsi/client (¿sin internet o bloqueado?).");
        mostrarBotonDeshabilitado("No se pudo cargar Google");
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: manejarRespuestaGoogle
    });

    dibujarBoton();

    // Si cambia el tamaño de la pantalla (ej.: girar el celular), se
    // vuelve a dibujar con el ancho nuevo.
    let temporizador;
    window.addEventListener("resize", () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(dibujarBoton, 250);
    });
};

iniciarGoogle();
