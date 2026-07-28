import cron from "node-cron";
import { obtenerTurnosDeManana } from "../repositories/turno.repository";
import { enviarWhatsApp } from "../whatsapp/whatsapp.service";

export function iniciarSchedulerRecordatorios() {

  // Corre todos los días a las 9:00 AM, (0 9 * * *) hora del servidor. pra probar "*/1 * * * *"
  cron.schedule("*/1 * * * *", async () => {

    console.log("⏰ Ejecutando recordatorios de turnos de mañana...");

    try {

      const turnos = await obtenerTurnosDeManana();

      for (const turno of turnos) {

        const horaLegible = new Date(turno.fecha)
          .toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

        await enviarWhatsApp(
          turno.cliente_telefono,
          `Hola ${turno.cliente_nombre}! Te recordamos tu turno de ${turno.servicio_nombre} mañana ${horaLegible} con ${turno.empleado_nombre}. Si no podés venir, avisanos con tiempo 🙏`
        );

      }

      console.log(`🟢 Recordatorios enviados: ${turnos.length}`);

    } catch (error) {

      console.error("🔴 Error en scheduler de recordatorios:", error);

    }

  });

  console.log("🟢 Scheduler de recordatorios iniciado (9:00 AM diario)");

}