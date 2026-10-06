// src/app.ts
import path from "node:path";
import express, { type Application } from "express";
import cors from "cors";
import usuarioRoutes from "./interfaces/routes/usuario.routes";

export const app: Application = express();

app.use(cors());

app.use(express.json());

// Sirve el frontend estático (carpeta "Frontend", hermana de "Backend") desde el mismo server.
// Así http://localhost:3000/ abre index.html y http://localhost:3000/pages/registro.html
// abre la pantalla de registro, todo en el mismo origen que la API (sin problemas de CORS).
const FRONTEND_DIR = path.resolve(process.cwd(), "..", "Front");
app.use(express.static(FRONTEND_DIR));

app.use(usuarioRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;