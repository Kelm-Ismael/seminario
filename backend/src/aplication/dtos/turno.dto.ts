// application/dtos/turno.dto.ts
// DTOs = lo que entra y sale por la API (lo que ve el frontend)
// Separan la entidad interna del contrato HTTP

import { TipoServicio, EstadoTurno } from '../../domain/entities/turno.entity'

// ── Entrada: lo que manda el frontend al crear un turno ──────────────

export interface CrearTurnoDTO {
  fecha:    string       // "2026-07-21"  (string porque viene del formulario HTML)
  hora:     string       // "10:00"
  servicio: TipoServicio // "Corte unisex" | "barba" | "tintura"

  // Opcionales por ahora — los agregás cuando sumes clientes y profesionales
  clienteId?:     string
  profesionalId?: string
}

// ── Salida: lo que devuelve la API al frontend ────────────────────────

export interface TurnoResponseDTO {
  id:        string
  fecha:     string       // formateado para mostrar: "21/7/2026, 09:22:00"
  hora:      string
  servicio:  TipoServicio
  estado:    EstadoTurno

  // Opcionales — cuando los tengas
  clienteNombre?:      string
  profesionalNombre?:  string
}

// ── Entrada: actualizar estado de un turno ────────────────────────────

export interface ActualizarEstadoDTO {
  estado: EstadoTurno
}

// ── Helper: convierte la entidad al DTO de respuesta ─────────────────
// Lo usás en el controller para no exponer campos internos

import { Turno } from '../../domain/entities/turno.entity'

export function turnoToResponseDTO(turno: Turno): TurnoResponseDTO {
  return {
    id:       turno.id,
    fecha:    turno.fecha.toLocaleString('es-AR'),
    hora:     turno.hora,
    servicio: turno.servicio,
    estado:   turno.estado,
  }
}