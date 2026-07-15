// import express from 'express'
// import cors from "cors";
// import turnoRoutes from "./interfaces/routes/turno.routes"
// import clienteRoutes from './interfaces/routes/cliente.routes';

// const app = express() //crea aplicacion express

// app.use(express.json()) // Middleware para permitir JSON sin esto req.body llega undefinded

// app.use(cors());
// app.use("/turnos", turnoRoutes);
// app.use("/cliente", clienteRoutes)

// export default app

import express from "express";
import cors from "cors";
import path from "path";

import turnoRoutes from "./interfaces/routes/turno.routes";
import clienteRoutes from "./interfaces/routes/cliente.routes";

const app = express();

app.use(express.json());
app.use(cors());

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// API
app.use("/turnos", turnoRoutes);
app.use("/cliente", clienteRoutes);

export default app;