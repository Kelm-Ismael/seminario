// Archivo NUEVO — issue #20
import { Request, Response } from "express";
import { registrarUsuarioCasoDeUso } from "../../aplication/use-cases/registrarUsuario";
import { validarTokenCasoDeUso } from "../../aplication/use-cases/validarToken";
import { reenviarCodigoCasoDeUso } from "../../aplication/use-cases/reenviarCodigo";
import { iniciarRegistroGoogleCasoDeUso } from "../../aplication/use-cases/iniciarRegistroGoogle";
import { registrarUsuarioGoogleCasoDeUso } from "../../aplication/use-cases/registrarUsuarioGoogle";

// POST /registro
export const registrarUsuarioController = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, apellido, fecha_nacimiento, celular } = req.body;

    const resultado = await registrarUsuarioCasoDeUso({
      email, password, nombre, apellido, fecha_nacimiento, celular
    });

    res.status(201).json({
      mensaje: "Registro exitoso. Revisá tu correo para confirmar tu cuenta.",
      usuario: {
        id_usuario: resultado.usuario.id_usuario,
        email: resultado.usuario.email,
        estado_cuenta: resultado.usuario.estado_cuenta
      }
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Ya existe una cuenta registrada con ese email") {
      res.status(409).json({ message: error.message });
      return;
    }

     if (
      error.message === "El email es obligatorio" ||
      error.message === "La contraseña es obligatoria" ||
      error.message === "La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula y un número" ||
      error.message === "El nombre es obligatorio" ||
      error.message === "El apellido es obligatorio" ||
      error.message === "La fecha de nacimiento es obligatoria" ||
      error.message === "El celular es obligatorio"

    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// POST /verificar-cuenta  { email, codigo }
export const verificarCuentaController = async (req: Request, res: Response) => {
  try {
    const { email, codigo } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({ message: "Falta el email" });
      return;
    }
    if (!codigo || typeof codigo !== "string") {
      res.status(400).json({ message: "Falta el código" });
      return;
    }

    const usuario = await validarTokenCasoDeUso(email, codigo);

    res.status(200).json({
      mensaje: "Cuenta verificada correctamente. Ya podés iniciar sesión.",
      estado_cuenta: usuario.estado_cuenta
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "No existe una cuenta registrada con ese email") {
      res.status(404).json({ message: error.message });
      return;
    }

    if (
      error.message === "No hay ningún código pendiente para esta cuenta" ||
      error.message === "El código expiró, tenés que pedir uno nuevo" ||
      error.message === "El código ingresado es incorrecto" ||
      error.message === "Superaste el máximo de intentos, tenés que pedir un código nuevo"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al verificar la cuenta" });
  }
};

// POST /reenviar-codigo  { email }
export const reenviarCodigoController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({ message: "Falta el email" });
      return;
    }

    await reenviarCodigoCasoDeUso(email);

    res.status(200).json({ mensaje: "Te enviamos un nuevo código a tu correo." });
  } catch (error: any) {
    console.error(error);

    if (error.message === "No existe una cuenta registrada con ese email") {
      res.status(404).json({ message: error.message });
      return;
    }

    if (error.message === "Esta cuenta ya está verificada") {
      res.status(409).json({ message: error.message });
      return;
    }

    if (typeof error.message === "string" && error.message.startsWith("Esperá ")) {
      res.status(429).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al reenviar el código" });
  }
};

// POST /registro/google/verificar  { idToken }
// Paso 1 del registro con Google: verifica el token y avisa si la cuenta
// ya existe. Si es cuenta nueva, devuelve el perfil de Google (email,
// nombre, apellido, googleId) para que el frontend complete lo que falta.
export const iniciarRegistroGoogleController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    const perfil = await iniciarRegistroGoogleCasoDeUso(idToken);

    res.status(200).json({ perfil });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Ya existe una cuenta registrada con ese email. Iniciá sesión en su lugar.") {
      res.status(409).json({ message: error.message });
      return;
    }

    if (
      error.message === "Falta el token de Google" ||
      error.message === "El token de Google no es válido o expiró" ||
      error.message === "El token de Google no corresponde a esta aplicación" ||
      error.message === "Tu cuenta de Google no tiene el email verificado"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al verificar la cuenta de Google" });
  }
};

// POST /registro/google  { googleId, email, nombre, apellido, fecha_nacimiento, celular }
// Paso 2: crea la cuenta ya con celular y fecha de nacimiento. Queda activa
// directo (Google ya verificó el email).
export const registrarUsuarioGoogleController = async (req: Request, res: Response) => {
  try {
    const { googleId, email, nombre, apellido, fecha_nacimiento, celular } = req.body;

    const resultado = await registrarUsuarioGoogleCasoDeUso({
      googleId, email, nombre, apellido, fecha_nacimiento, celular
    });

    res.status(201).json({
      mensaje: "Cuenta creada correctamente con Google. Ya podés iniciar sesión.",
      usuario: {
        id_usuario: resultado.usuario.id_usuario,
        email: resultado.usuario.email,
        estado_cuenta: resultado.usuario.estado_cuenta
      }
    });
  } catch (error: any) {
    console.error(error);

    if (error.message === "Ya existe una cuenta registrada con ese email") {
      res.status(409).json({ message: error.message });
      return;
    }

    if (
      error.message === "Falta la información de Google" ||
      error.message === "El nombre es obligatorio" ||
      error.message === "El apellido es obligatorio" ||
      error.message === "La fecha de nacimiento es obligatoria" ||
      error.message === "El celular es obligatorio" ||
      error.message === "La fecha de nacimiento no es válida" ||
      error.message === "La fecha de nacimiento no puede ser una fecha futura" ||
      error.message === "Tenés que ser mayor de 18 años para registrarte" ||
      error.message === "La edad máxima para registrarte es 70 años" ||
      error.message === "El celular debe tener el formato +54 seguido del código de área y número (solo dígitos, sin espacios ni guiones)"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error al crear la cuenta con Google" });
  }
};
