export const PORT = process.env.PORT || 3000

//export const DB_URL = process.env.DB_URL || ''
//export const JWT_SECRET = process.env.JWT_SECRET || ''

export const host_db = process.env.host_db || "localhost"; // servidor db
export const usuario_db = process.env.usuario_db || "postgres"; // usuario db
export const contraseña_db = process.env.contraseña_db || "476235";
export const nombre_db = process.env.nombre_db || "peluqueria"; //nombre db
export const puerto_db = process.env.puerto_db || "5432"; //puerto de PostgresSQ

// Twilio / WhatsApp
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "AC5ff95232ac4e9136f02668c38405435c";
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "d5926a02ce7e282ea2fd4e165b308926";
export const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // número del sandbox +14155238886


