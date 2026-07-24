import { crearEmpleado as crearEmpleadoRepository } from "../../infrastructure/repositories/empleado.repository";

export const crearEmpleadoCasoDeUso = async (
    nombre: string,
    telefono: string,
    email: string
) => {

    if (!nombre.trim()) {
        throw new Error("El nombre es obligatorio");
    }

    const empleadoCreado = await crearEmpleadoRepository(
        nombre, telefono, email
    );

    return empleadoCreado;
};