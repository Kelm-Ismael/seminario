// domain/entities/turno.entity.ts
// Entidad pura — no importa nada externo (sin Express, sin Prisma)

export type EstadoTurno = 'pendiente' | 'confirmado' | 'completado' | 'cancelado'

export type TipoServicio = 'Corte unisex' | 'barba' | 'tintura'

export class Turno {
  constructor(
    public readonly id:        string,
    public readonly fecha:     Date,
    public readonly hora:      string,   // "10:00"
    public readonly servicio:  TipoServicio,
    public readonly estado:    EstadoTurno,
    public readonly creadoEn:  Date,

    // Agregás estos campos cuando conectes clientes y profesionales
    public readonly clienteId?:     string,
    public readonly profesionalId?: string,
  ) {}

  // ── Reglas de negocio dentro de la entidad ──────────────────────────

  estaDisponible(): boolean {
    return this.estado === 'pendiente' || this.estado === 'confirmado'
  }

    esPasado(): boolean {
      const ahora    = new Date()
      const [h, m]   = this.hora.split(':').map(Number)
      const fechaHora = new Date(this.fecha)
      fechaHora.setHours(h ?? 0, m ?? 0, 0, 0)
      return fechaHora < ahora
  }

  puedesCancelar(): boolean {
    return this.estado === 'pendiente' || this.estado === 'confirmado'
  }
}