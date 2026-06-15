'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Horario, HorariosPorDia, NOMBRE_DIA, ORDEN_DIAS, sortHorarios } from '@/types'
import AdminToggle from '@/components/AdminToggle'
import Logo from '@/components/Logo'
import { LogOut, RefreshCw } from 'lucide-react'

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [horariosPorDia, setHorariosPorDia] = useState<HorariosPorDia>({})
  const [loading, setLoading] = useState(false)
  const [reseteando, setReseteando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { data } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'password')
      .single()

    if (data?.value === password) {
      setAutenticado(true)
      fetchHorarios()
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const fetchHorarios = async () => {
    setLoading(true)
    const { data } = await supabase.from('horarios').select('*').order('dia').order('hora')
    if (data) {
      const agrupado: HorariosPorDia = {}
      for (const h of data as Horario[]) {
        if (!agrupado[h.dia]) agrupado[h.dia] = []
        agrupado[h.dia].push(h)
      }
      setHorariosPorDia(agrupado)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!autenticado) return
    const channel = supabase
      .channel('horarios-admin')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'horarios' }, (payload) => {
        const updated = payload.new as Horario
        setHorariosPorDia((prev) => {
          const dia = { ...prev }
          dia[updated.dia] = dia[updated.dia].map((h) =>
            h.id === updated.id ? { ...h, disponible: updated.disponible } : h
          )
          return { ...dia }
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [autenticado])

  const handleUpdate = (id: string, disponible: boolean) => {
    setHorariosPorDia((prev) => {
      const next = { ...prev }
      for (const dia of Object.keys(next)) {
        next[dia] = next[dia].map((h) => (h.id === id ? { ...h, disponible } : h))
      }
      return next
    })
  }

  const resetearSemana = async () => {
    setReseteando(true)
    await supabase.from('horarios').update({ disponible: true }).neq('id', '')
    await fetchHorarios()
    setReseteando(false)
  }

  const diasOrdenados = ORDEN_DIAS.filter((d) => horariosPorDia[d])

  if (!autenticado) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{ background: 'var(--c-bg)' }}
      >
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div className="flex flex-col">
              <span
                className="text-xl leading-tight"
                style={{ fontFamily: "var(--font-display)", color: 'var(--c-ink)' }}
              >
                Panel de administración
              </span>
              <span className="text-xs" style={{ color: 'var(--c-muted)' }}>R Studio Nails</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A9AB5]"
              style={{
                background: 'var(--c-surface)',
                color: 'var(--c-ink)',
                border: '1px solid rgba(90,154,181,0.3)',
              }}
              autoFocus
            />
            {error && (
              <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-medium text-white transition-opacity active:opacity-80"
              style={{ background: 'var(--c-brand)' }}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--c-bg)' }}>
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">

        {/* Header */}
        <header className="px-5 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span
              className="text-lg"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--c-ink)' }}
            >
              Administración
            </span>
          </div>
          <button
            onClick={() => setAutenticado(false)}
            className="p-2 rounded-lg transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-brand)]"
            style={{ color: 'var(--c-muted)' }}
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </header>

        {/* Reset button */}
        <div className="px-5 pb-4">
          <button
            onClick={resetearSemana}
            disabled={reseteando}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-brand)]"
            style={{ background: 'var(--c-surface)', color: 'var(--c-muted)', border: '1px solid rgba(90,154,181,0.2)' }}
          >
            <RefreshCw size={14} className={reseteando ? 'animate-spin' : ''} aria-hidden="true" />
            {reseteando ? 'Reseteando...' : 'Resetear semana'}
          </button>
        </div>

        {/* Horarios */}
        <main className="flex-1 px-5 pb-8">
          {loading ? (
            <div className="flex flex-col gap-4" aria-label="Cargando horarios">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--c-surface)' }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {diasOrdenados.map((dia) => (
                <section key={dia} aria-labelledby={`admin-dia-${dia}`} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <h2
                      id={`admin-dia-${dia}`}
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
                      }}
                    >
                      {horariosPorDia[dia][0]?.tipo === 'salon' ? 'Salón' : 'A domicilio'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {sortHorarios(horariosPorDia[dia]).map((h) => (
                      <AdminToggle key={h.id} horario={h} onUpdate={handleUpdate} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  )
}
