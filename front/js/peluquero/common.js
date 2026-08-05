// Helpers compartidos por todas las páginas del panel peluquero.
// No hace fetch ni conoce endpoints — de eso se encargan core/api.js
// y core/config.js, esto solo son funciones de formato/fecha reutilizadas.

// TODO: reemplazar por el id/nombre real cuando exista login de empleado
// (mismo patrón que cliente_id hardcodeado en reservar-turno.js)
export const EMPLEADO_ID = 1;
export const EMPLEADO_NOMBRE = "Peluquero/a";

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