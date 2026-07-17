// Importa la aplicación Express configurada en app.ts.
// Allí están los middlewares, las rutas y la configuración del frontend.
import app from './app'

// Importa el puerto definido en las variables de entorno (.env).
import { PORT } from './config/env'

// Importa la función que realiza la conexión con PostgreSQL.
import { conexion_db } from './config/db'

// Inicia el servidor Express en el puerto especificado.
// Cuando el servidor comienza a escuchar peticiones,
// primero intenta conectarse a la base de datos.
app.listen(PORT, async () => {

  // Conecta con PostgreSQL.
  await conexion_db();

  // Muestra un mensaje indicando que el servidor está funcionando.
  console.log(`\x1b[32m🟢 Servidor corriendo en puerto ${PORT}\x1b[0m`)
})

// Captura la combinación Ctrl + C en la terminal.
// Permite finalizar el servidor de forma controlada.
process.on('SIGINT', () => {

  console.log('\n🛑 Servidor detenido')

  process.exit(0)
})

// Captura cuando el sistema operativo o un administrador
// solicita terminar el proceso del servidor.
process.on('SIGTERM', () => {

  console.log('🛑 Servidor terminado (SIGTERM)')

  process.exit(0)
})





// // Carga automáticamente las variables del archivo .env
// import 'dotenv/config'

// // Importa Express (framework para crear el servidor)
// import express from 'express'

// // Crea la aplicación de Express
// const app = express()

// // Define una ruta GET en la raíz "/"
// // Cuando alguien entra a http://localhost:3000/
// app.get('/', (req, res) => {
//   // Responde con este mensaje
//   res.send('Servidor funcionando')
// })

// // Inicia el servidor en el puerto definido en .env o 3000 por defecto
// app.listen(process.env.PORT || 3000, () => {
//   // Muestra mensaje en consola cuando el servidor arranca
//   console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`)
// })

// // dotenv → carga variables de entorno
// // express() → crea el servidor
// // app.get() → define rutas
// // app.listen() → levanta el servidor

