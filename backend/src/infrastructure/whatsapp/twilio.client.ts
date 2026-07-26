console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TOKEN len:", process.env.TWILIO_AUTH_TOKEN?.length);


import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../../config/env";

// Si faltan credenciales, el cliente queda sin inicializar
// para no romper el arranque del server en desarrollo.
export const twilioClient =
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;