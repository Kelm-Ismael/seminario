// domain/repositories/turno.repository.ts
// Interface pura — define QUÉ se puede hacer, sin decir CÓMO
// La implementación real va en infrastructure/ con Prisma

import { Turno, EstadoTurno } from '../entities/turno.entity'

export interface ITurnoRepository {

  // ── Lectura ───────────────────────────────────────────────────────────

  findById(id: string): Promise<Turno | null>

  findAll(): Promise<Turno[]>

  findByFecha(fecha: Date): Promise<Turno[]>

  // Para los recordatorios de WhatsApp del día siguiente
  findTurnosMañana(): Promise<Turno[]>

  // Para saber si un slot ya está ocupado antes de crear un turno
  findByFechaYHora(fecha: Date, hora: string): Promise<Turno | null>

  // ── Escritura ─────────────────────────────────────────────────────────

  save(turno: Turno): Promise<Turno>

  updateEstado(id: string, estado: EstadoTurno): Promise<Turno>

  delete(id: string): Promise<void>
}