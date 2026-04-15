import app from './app'
import { PORT } from './config/env'


app.listen(PORT, () => {
  console.log(`\x1b[32m🟢 Servidor corriendo en puerto ${PORT}\x1b[0m`)
})

// Captura Ctrl + C (SIGINT)
process.on('SIGINT', () => {
  console.log('\n🛑 Servidor detenido')
  process.exit(0)
})

// Captura cierre del sistema o proceso
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

