import express from 'express'
import cors from "cors";
import turnoRoutes from "./interfaces/routes/turno.routes"
const app = express()
app.use(express.json())

app.use(cors());
app.use("/turnos", turnoRoutes);

export default app