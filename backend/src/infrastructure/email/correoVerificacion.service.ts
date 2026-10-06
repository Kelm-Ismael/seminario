// Archivo NUEVO — issue #21 (Escenario 3: Autenticar cuenta — envío real del mail)
// Reemplaza el console.log placeholder que había quedado en registrarUsuario.ts (#20).
// Actualizado: se manda el código de 6 dígitos para que el usuario lo tipee
// en la pantalla "Confirmá tu cuenta" (antes era un link con el token).
import { transporter } from "./nodemailer.transport.js";

// Envía el mail de verificación de cuenta con el código de 6 dígitos.
export const enviarCorreoVerificacion = async (
  destinatario: string,
  codigo: string
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: "Confirmá tu cuenta - Peluquería&Barbería",
    html: `
      <p>¡Gracias por registrarte!</p>
      <p>Tu código de verificación es:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${codigo}</p>
      <p>Ingresalo en la pantalla de confirmación para activar tu cuenta (válido por 24 horas).</p>
      <p>Si no fuiste vos quien se registró, podés ignorar este mensaje.</p>
    `,
  });
};