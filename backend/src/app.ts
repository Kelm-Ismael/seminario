import express, { Application } from "express";
import cors from "cors";
import path from "path";

import usuarioRoutes from "./interfaces/routes/usuario.routes.js";
import turnoRoutes from "./interfaces/routes/turno.routes";
import clienteRoutes from "./interfaces/routes/cliente.routes";
import servicioRoutes from "./interfaces/routes/Servicio.routes";
import empleadoRoutes from "./interfaces/routes/empleado.routes";

export const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../front")));

app.use("/turnos", turnoRoutes);
app.use("/cliente", clienteRoutes);
app.use("/servicios", servicioRoutes);
app.use("/empleados", empleadoRoutes);
app.use(usuarioRoutes);

const FRONTEND_DIR = path.resolve(process.cwd(), "..", "Frontend");
app.use(express.static(FRONTEND_DIR));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;