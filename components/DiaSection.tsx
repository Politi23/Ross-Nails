import { Horario, NOMBRE_DIA, Tipo, sortHorarios } from '@/types'
import HorarioCard from './HorarioCard'

interface Props {
  dia: string
  tipo: Tipo
  horarios: Horario[]
  onSelect?: (horario: Horario) => void
}

export default function DiaSection({ dia, tipo, horarios, onSelect }: Props) {
  const sorted = sortHorarios(horarios)
  return (
    <section aria-labelledby={`dia-${dia}`} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2
          id={`dia-${dia}`}
          className="text-xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--c-ink)', fontWeight: 400 }}
        >
          {NOMBRE_DIA[dia]}
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(90,154,181,0.12)',
            color: 'var(--c-brand)',
            border: '1px solid rgba(90,154,181,0.25)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {tipo === 'salon' ? 'Salón' : 'A domicilio'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sorted.map((h) => (
          <HorarioCard key={h.id} horario={h} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
