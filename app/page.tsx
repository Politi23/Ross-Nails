'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Horario, HorariosPorDia, ORDEN_DIAS, Tipo } from '@/types'
import Logo from '@/components/Logo'
import DiaSection from '@/components/DiaSection'
import ConfirmOverlay from '@/components/ConfirmOverlay'

export default function Home() {
  const [horariosPorDia, setHorariosPorDia] = useState<HorariosPorDia>({})
  const [seleccionado, setSeleccionado] = useState<Horario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchHorarios = async () => {
      const { data, error: err } = await supabase.from('horarios').select('*')
      if (err || !data) {
        setError(true)
      } else {
        const agrupado: HorariosPorDia = {}
        for (const h of data as Horario[]) {
          if (!agrupado[h.dia]) agrupado[h.dia] = []
          agrupado[h.dia].push(h)
        }
        setHorariosPorDia(agrupado)
      }
      setLoading(false)
    }

    fetchHorarios()

    const channel = supabase
      .channel('horarios-publico')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'horarios' }, (payload) => {
        const updated = payload.new as Horario
        setHorariosPorDia((prev) => {
          const next = { ...prev }
          next[updated.dia] = next[updated.dia].map((h) =>
            h.id === updated.id ? { ...h, disponible: updated.disponible } : h
          )
          return next
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const diasOrdenados = ORDEN_DIAS.filter((d) => horariosPorDia[d])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--c-bg)' }}>
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">

        {/* Header */}
        <header className="px-5 pt-8 pb-6 flex items-center gap-3">
          <Logo size={48} />
          <div className="flex flex-col">
            <span
              className="text-2xl leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--c-ink)' }}
            >
              R Studio
            </span>
            <span className="text-sm" style={{ color: 'var(--c-muted)', fontFamily: 'var(--font-ui)' }}>
              Nails by Rosibel
            </span>
          </div>
        </header>

        {/* Horarios */}
        <main className="flex-1 px-5 pb-8" aria-live="polite" aria-label="Horarios disponibles">
          {loading && (
            <div className="flex flex-col gap-4" aria-label="Cargando horarios">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--c-surface)' }} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12">
              <p style={{ color: 'var(--c-muted)' }} className="text-sm">
                No se pudieron cargar los horarios.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm underline underline-offset-2"
                style={{ color: 'var(--c-brand)' }}
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-8">
              {diasOrdenados.map((dia) => (
                <DiaSection
                  key={dia}
                  dia={dia}
                  tipo={horariosPorDia[dia][0]?.tipo as Tipo}
                  horarios={horariosPorDia[dia]}
                  onSelect={setSeleccionado}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-5 py-6 flex justify-center">
          <a
            href="https://instagram.com/ross.nailsve"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--c-muted)' }}
            aria-label="Instagram de Ross Nails Venezuela"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            <span className="text-sm">@ross.nailsve</span>
          </a>
        </footer>

      </div>

      <ConfirmOverlay horario={seleccionado} onClose={() => setSeleccionado(null)} />
    </div>
  )
}
