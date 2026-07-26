import { twilioClient } from "./twilio.client";
import { TWILIO_WHATSAPP_FROM } from "../../config/env";

// Formatea un teléfono argentino a formato WhatsApp de Twilio.
// Asume que "telefono" viene sin espacios/guiones raros y sin código de país.
// Ej: "3764123456" -> "whatsapp:+543764123456"
// OJO: esto es una heurística simple. Si el teléfono ya viene con
// código de país (+54...) o mal cargado, vas a tener que ajustar esto
// o pedirle al usuario que cargue el teléfono en formato E.164 directamente.
export function formatearTelefonoAR(telefono: string): string {
  const limpio = telefono.replace(/[^\d]/g, "");

  if (limpio.startsWith("54")) {
    return `whatsapp:+${limpio}`;
  }

  return `whatsapp:+549${limpio}`;
}

export async function enviarWhatsApp(telefono: string, mensaje: string) {

  if (!twilioClient) {
    console.warn("⚠️ Twilio no configurado, no se envía WhatsApp:", mensaje);
    return;
  }

  try {

    const to = formatearTelefonoAR(telefono);

    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to,
      body: mensaje
    });

    console.log(`🟢 WhatsApp enviado a ${to}`);

  } catch (error) {

    // No relanzamos el error: que falle el WhatsApp no debe
    // romper la creación del turno ni el scheduler.
    console.error("🔴 Error al enviar WhatsApp:", error);

  }

}