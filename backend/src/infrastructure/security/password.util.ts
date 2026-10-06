// Necesita: npm install bcryptjs && npm install --save-dev @types/bcryptjs
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Para el login (sprint futuro): compara una password contra el hash guardado
export const verificarPassword = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};