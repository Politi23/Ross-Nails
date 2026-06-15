export type Tipo = 'salon' | 'domicilio'

export interface Horario {
  id: string
  dia: string
  hora: string
  disponible: boolean
  tipo: Tipo
}

export type HorariosPorDia = Record<string, Horario[]>

export const ORDEN_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

export const NOMBRE_DIA: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
}

// Orden cronológico de horas — evita ordenamiento alfabético erróneo de Supabase
const ORDEN_HORAS = ['8:00', '8:20', '9:30', '10:00', '10:20', '1:00', '3:00', '5:00']

export function sortHorarios(horarios: Horario[]): Horario[] {
  return [...horarios].sort(
    (a, b) => ORDEN_HORAS.indexOf(a.hora) - ORDEN_HORAS.indexOf(b.hora)
  )
}

// Horas de tarde (PM)
const HORAS_PM = new Set(['1:00', '3:00', '5:00'])

export function formatHora(hora: string): string {
  const sufijo = HORAS_PM.has(hora) ? ' PM' : ' AM'
  return hora + sufijo
}
