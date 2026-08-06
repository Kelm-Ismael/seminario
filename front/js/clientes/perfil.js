(async function () {
    const { getDatos } = await import("../core/api.js");
    const { API_CLIENTES } = await import("../core/config.js");

    const CLIENTE_ID = 1; // TODO: reemplazar cuando haya login de cliente

    const el = {
        avatar: document.getElementById("perfilAvatar"),
        nombreDestacado: document.getElementById("perfilNombre"),
        datoNombre: document.getElementById("datoNombre"),
        datoEmail: document.getElementById("datoEmail"),
        datoTelefono: document.getElementById("datoTelefono"),
    };
    if (!el.avatar) return;

    try {
        const clientes = await getDatos(API_CLIENTES);
        const cliente = clientes.find(c => c.id_clientes === CLIENTE_ID);

        if (!cliente) {
            el.nombreDestacado.textContent = "Cliente no encontrado";
            return;
        }

        el.avatar.textContent = iniciales(cliente.nombre);
        el.nombreDestacado.textContent = cliente.nombre;
        el.datoNombre.textContent = cliente.nombre;
        el.datoEmail.textContent = cliente.email || "Sin registrar";
        el.datoTelefono.textContent = cliente.telefono || "Sin registrar";

    } catch (err) {
        console.error("Error cargando el perfil:", err);
        el.nombreDestacado.textContent = "Error al cargar";
        el.datoNombre.textContent = "-";
        el.datoEmail.textContent = "-";
        el.datoTelefono.textContent = "-";
    }

    function iniciales(nombre) {
        if (!nombre) return "??";
        return nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join("");
    }
})();