'use client'

import { Horario, formatHora } from '@/types'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface Props {
  horario: Horario
  onUpdate: (id: string, disponible: boolean) => void
}

export default function AdminToggle({ horario, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const toggle = async () => {
    setLoading(true)
    setSaveError(false)
    const nuevoEstado = !horario.disponible
    const { error } = await supabase
      .from('horarios')
      .update({ disponible: nuevoEstado })
      .eq('id', horario.id)

    if (error) {
      setSaveError(true)
    } else {
      onUpdate(horario.id, nuevoEstado)
    }
    setLoading(false)
  }

  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-3"
      style={{
        background: horario.disponible ? 'var(--c-surface)' : 'var(--c-blocked-bg)',
        border: `1px solid ${horario.disponible ? 'rgba(90,154,181,0.3)' : 'transparent'}`,
      }}
    >
      <div className="flex flex-col">
        <span
          className="text-sm font-medium"
          style={{
            color: horario.disponible ? 'var(--c-ink)' : 'var(--c-blocked-ink)',
            textDecoration: horario.disponible ? 'none' : 'line-through',
          }}
        >
          {formatHora(horario.hora)}
        </span>
        {saveError && (
          <span className="text-xs" style={{ color: '#ef4444' }}>Error al guardar</span>
        )}
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        role="switch"
        aria-checked={horario.disponible}
        aria-label={`${formatHora(horario.hora)} — ${horario.disponible ? 'disponible, toca para marcar ocupado' : 'ocupado, toca para marcar disponible'}`}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-brand)] disabled:opacity-50"
        style={{ background: horario.disponible ? 'var(--c-brand)' : 'var(--c-blocked-ink)' }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
          style={{ transform: horario.disponible ? 'translateX(20px)' : 'translateX(0)' }}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
