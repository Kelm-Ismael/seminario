
// Importa el framework Express para crear la aplicación web y la API REST.
import express from "express";

// Importa el middleware CORS, que permite que el frontend pueda comunicarse con el backend.
import cors from "cors";

// Importa el módulo 'path' de Node.js para trabajar con rutas de archivos y carpetas.
import path from "path";

// Importa las rutas relacionadas con los turnos.
import turnoRoutes from "./interfaces/routes/turno.routes";

// Importa las rutas relacionadas con los clientes.
import clienteRoutes from "./interfaces/routes/cliente.routes";

// Crea una instancia de la aplicación Express.
// Sobre esta instancia se configuran middlewares, rutas y el frontend.
const app = express();

// Middleware que permite recibir datos en formato JSON.
// Sin esta línea, req.body llegaría como undefined en las peticiones POST y PUT.
app.use(express.json());

// Middleware que habilita CORS.
// Permite que el frontend (por ejemplo http://localhost:5500)
// pueda hacer peticiones al backend (http://localhost:3000).
app.use(cors());

// Indica a Express que sirva los archivos estáticos del frontend.
// Cuando un navegador solicite '/', Express buscará automáticamente
// el archivo index.html dentro de la carpeta "frontend".
// También servirá CSS, JavaScript, imágenes, íconos, etc.
app.use(express.static(path.join(__dirname, "../../front")));

// Registra todas las rutas relacionadas con turnos.
// Las peticiones que comiencen con "/turnos"
// serán gestionadas por turnoRoutes.
app.use("/turnos", turnoRoutes);

// Registra todas las rutas relacionadas con clientes.
// Las peticiones que comiencen con "/cliente"
// serán gestionadas por clienteRoutes.
app.use("/cliente", clienteRoutes);

// Exporta la aplicación Express para que pueda ser utilizada
// desde server.ts, donde finalmente se inicia el servidor.
export default app;




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