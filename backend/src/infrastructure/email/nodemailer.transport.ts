// Archivo NUEVO — issue #21 (Backend: Integración correo e-mail)
// Transporter de Nodemailer configurado con SMTP de Gmail.
//
// Requiere en el .env:
//   EMAIL_USER = la cuenta de Gmail que envía los correos
//   EMAIL_PASS = un "App Password" de esa cuenta (NO la contraseña normal de Gmail;
//                se genera en https://myaccount.google.com/apppasswords, requiere
//                tener la verificación en 2 pasos activada)
//
// Necesita: npm install nodemailer && npm install --save-dev @types/nodemailer
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});