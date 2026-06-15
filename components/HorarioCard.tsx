'use client'

import { Horario, formatHora } from '@/types'

interface Props {
  horario: Horario
  onSelect?: (horario: Horario) => void
}

export default function HorarioCard({ horario, onSelect }: Props) {
  if (!horario.disponible) {
    return (
      <div
        className="rounded-lg px-4 py-3 text-center select-none"
        style={{ background: 'var(--c-blocked-bg)' }}
        aria-label={`${formatHora(horario.hora)} — ocupado`}
        role="img"
      >
        <span
          className="text-sm font-medium line-through"
          style={{ color: 'var(--c-blocked-ink)' }}
          aria-hidden="true"
        >
          {formatHora(horario.hora)}
        </span>
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelect?.(horario)}
      className="horario-card rounded-lg px-4 py-3 text-center w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-brand)]"
      aria-label={`Reservar ${formatHora(horario.hora)}`}
    >
      <span className="text-sm font-medium" style={{ color: 'var(--c-ink)' }}>
        {formatHora(horario.hora)}
      </span>
    </button>
  )
}
