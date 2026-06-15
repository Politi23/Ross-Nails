'use client'

import { useEffect, useId, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { Horario, NOMBRE_DIA, formatHora } from '@/types'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

interface Props {
  horario: Horario | null
  onClose: () => void
}

export default function ConfirmOverlay({ horario, onClose }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Trap focus and handle Escape
  useEffect(() => {
    if (!horario) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [horario, onClose])

  const whatsappUrl = horario
    ? buildWhatsAppUrl(NOMBRE_DIA[horario.dia], formatHora(horario.hora))
    : '#'

  const slideVariants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  const slideTransition = shouldReduceMotion
    ? { duration: 0.15 }
    : { type: 'spring' as const, stiffness: 300, damping: 30 }

  return (
    <AnimatePresence>
      {horario && (
        <>
          <motion.div
            className="fixed inset-0"
            style={{ background: 'rgba(0,0,0,0.6)', zIndex: 'var(--z-overlay-bg)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0.1 } : undefined}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed bottom-0 left-0 right-0 rounded-t-2xl p-6 flex flex-col gap-5"
            style={{
              background: 'var(--c-surface)',
              border: '1px solid rgba(90,154,181,0.2)',
              zIndex: 'var(--z-overlay)',
            }}
            {...slideVariants}
            transition={slideTransition}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>
                  Confirmar cita
                </p>
                <h3
                  id={titleId}
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--c-ink)' }}
                >
                  {NOMBRE_DIA[horario.dia]}
                </h3>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-brand)]"
                style={{ color: 'var(--c-muted)' }}
                aria-label="Cerrar"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="flex gap-3">
              <div
                className="flex-1 rounded-lg p-3 text-center"
                style={{ background: 'var(--c-bg)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--c-muted)' }}>Hora</p>
                <p className="text-lg font-medium" style={{ color: 'var(--c-ink)' }}>{formatHora(horario.hora)}</p>
              </div>
              <div
                className="flex-1 rounded-lg p-3 text-center"
                style={{ background: 'var(--c-bg)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--c-muted)' }}>Modalidad</p>
                <p className="text-lg font-medium" style={{ color: 'var(--c-ink)' }}>
                  {horario.tipo === 'salon' ? 'Salón' : 'Domicilio'}
                </p>
              </div>
            </div>

            {/* Anchor tag en vez de window.open — no puede ser bloqueado por popup blockers */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full rounded-lg py-4 font-medium text-white text-center transition-opacity active:opacity-80 hover:opacity-90"
              style={{
                background: 'var(--c-brand)',
                fontFamily: 'var(--font-ui)',
                display: 'block',
              }}
            >
              Escribir a Rosibel
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
