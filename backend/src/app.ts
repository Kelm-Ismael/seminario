import express from 'express'
import cors from "cors";
import turnoRoutes from "./interfaces/routes/turno.routes"
import clienteRoutes from './interfaces/routes/cliente.routes';

const app = express() //crea aplicacion express

app.use(express.json()) // Middleware para permitir JSON sin esto req.body llega undefinded

app.use(cors());
app.use("/turnos", turnoRoutes);
app.use("/cliente", clienteRoutes)

export default app