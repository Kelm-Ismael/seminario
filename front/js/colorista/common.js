// Helpers compartidos por todas las páginas del panel colorista.
// No hace fetch ni conoce endpoints — de eso se encargan core/api.js
// y core/config.js, esto solo son funciones de formato/fecha reutilizadas.

// TODO: reemplazar por el id/nombre real cuando exista login de empleado
// (mismo patrón que cliente_id hardcodeado en reservar-turno.js)
export const EMPLEADO_ID = 3;
export const EMPLEADO_NOMBRE = "Colorista";

export function indexarPorId(lista, campoId) {
    const mapa = {};
    for (const item of lista) mapa[item[campoId]] = item;
    return mapa;
}

export function esMismoDia(fechaStr, fechaRef) {
    const fecha = new Date(fechaStr);
    return fecha.getFullYear() === fechaRef.getFullYear()
        && fecha.getMonth() === fechaRef.getMonth()
        && fecha.getDate() === fechaRef.getDate();
}

export function esHoy(fechaStr) {
    return esMismoDia(fechaStr, new Date());
}

export function esEstaSemana(fechaStr) {
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 7);
    return fecha >= inicioSemana && fecha < finSemana;
}

export function formatoHora(fechaStr) {
    return new Date(fechaStr).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function formatoFechaLarga(fecha) {
    const texto = fecha.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatoFechaCorta(fecha) {
    const texto = fecha.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatoMoneda(valor) {
    return "$" + Math.round(valor || 0).toLocaleString("es-AR");
}

export function iniciales(nombre) {
    if (!nombre) return "??";
    return nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join("");
}

export function capitalizar(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Pinta el saludo del topbar y los datos del usuario logueado.
// Todas las páginas comparten los mismos ids en el topbar (ver cualquier .html).
export function pintarTopbar({ tituloFecha } = {}) {
    document.getElementById("saludo-nombre").textContent = EMPLEADO_NOMBRE;
    document.getElementById("user-nombre").textContent = EMPLEADO_NOMBRE;
    document.getElementById("user-avatar").textContent = iniciales(EMPLEADO_NOMBRE);
    document.getElementById("brand-avatar").textContent = "DM";
    document.getElementById("saludo-fecha").textContent = tituloFecha || formatoFechaLarga(new Date());
}

/* ----------------------------------------------------------
   LOGO DEL NEGOCIO / FOTO DE PERFIL / MENÚ DE USUARIO
   Guardado en localStorage porque todavía no hay backend para
   subir archivos (ni endpoint de perfil de empleado). Cuando
   exista un endpoint real, reemplazar guardarEnStorage() por
   un postDatos/upload al backend.
---------------------------------------------------------- */
const CLAVE_LOGO = "colorista_logo_negocio";
const CLAVE_FOTO_PERFIL = "colorista_foto_perfil";

export function obtenerLogoGuardado() {
    return localStorage.getItem(CLAVE_LOGO);
}

export function obtenerFotoPerfilGuardada() {
    return localStorage.getItem(CLAVE_FOTO_PERFIL);
}

// Llamar una vez por página, después de pintarTopbar(), en cualquier
// página que tenga el shell completo (sidebar + topbar).
export function inicializarShell() {
    inicializarLogoUpload();
    inicializarFotoPerfilUpload();
    inicializarDropdownUsuario();
}

function leerArchivoComoDataUrl(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

function inicializarLogoUpload() {
    const trigger = document.getElementById("logo-upload");
    const input = document.getElementById("brand-logo-input");
    const img = document.getElementById("brand-logo-img");
    const inicialesDiv = document.getElementById("brand-avatar");
    if (!trigger || !input || !img || !inicialesDiv) return;

    const guardado = obtenerLogoGuardado();
    if (guardado) mostrarImagen(img, inicialesDiv, guardado);

    trigger.addEventListener("click", () => input.click());

    input.addEventListener("change", async () => {
        const archivo = input.files[0];
        if (!archivo) return;
        try {
            const dataUrl = await leerArchivoComoDataUrl(archivo);
            localStorage.setItem(CLAVE_LOGO, dataUrl);
            mostrarImagen(img, inicialesDiv, dataUrl);
        } catch (err) {
            console.error("No se pudo leer la imagen del logo:", err);
        }
    });
}

function inicializarFotoPerfilUpload() {
    const input = document.getElementById("user-avatar-input");
    const img = document.getElementById("user-avatar-img");
    const inicialesDiv = document.getElementById("user-avatar");
    const botonCambiar = document.getElementById("btn-cambiar-foto");
    if (!input || !img || !inicialesDiv) return;

    const guardada = obtenerFotoPerfilGuardada();
    if (guardada) mostrarImagen(img, inicialesDiv, guardada);

    if (botonCambiar) {
        botonCambiar.addEventListener("click", (ev) => {
            ev.stopPropagation();
            input.click();
        });
    }

    input.addEventListener("change", async () => {
        const archivo = input.files[0];
        if (!archivo) return;
        try {
            const dataUrl = await leerArchivoComoDataUrl(archivo);
            localStorage.setItem(CLAVE_FOTO_PERFIL, dataUrl);
            mostrarImagen(img, inicialesDiv, dataUrl);
            // Si la página tiene el avatar grande de Perfil, actualizarlo también.
            const avatarGrande = document.getElementById("perfil-avatar");
            const avatarGrandeImg = document.getElementById("perfil-avatar-img");
            if (avatarGrande && avatarGrandeImg) mostrarImagen(avatarGrandeImg, avatarGrande, dataUrl);
        } catch (err) {
            console.error("No se pudo leer la foto de perfil:", err);
        }
    });
}

function mostrarImagen(imgEl, fallbackEl, dataUrl) {
    imgEl.src = dataUrl;
    imgEl.style.display = "";
    fallbackEl.style.display = "none";
}

function inicializarDropdownUsuario() {
    const toggle = document.getElementById("panel-user");
    const dropdown = document.getElementById("user-dropdown");
    const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", () => dropdown.classList.toggle("open"));
    dropdown.addEventListener("click", (ev) => ev.stopPropagation());

    document.addEventListener("click", (ev) => {
        if (!toggle.contains(ev.target)) dropdown.classList.remove("open");
    });

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            // TODO: cuando haya sesión real, limpiar el token/estado de auth acá.
            window.location.href = "../../index.html";
        });
    }
}