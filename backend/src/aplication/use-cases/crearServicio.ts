import { crearServicio as crearServicioRepository } from "../../infrastructure/repositories/servicio.repository";

export const crearServicioCasoDeUso = async (
    nombre: string,
    precio: number,
    duracion: number
) => {

    // Validaciones simples
    if (!nombre.trim()) {
        throw new Error("El nombre es obligatorio");
    }

    if (precio < 0) {
        throw new Error("El precio no puede ser negativo");
    }

    if (duracion <= 0) {
        throw new Error("La duración debe ser mayor a 0");
    }

    const servicioCreado = await crearServicioRepository(
        nombre, precio, duracion
    );

    return servicioCreado;
};