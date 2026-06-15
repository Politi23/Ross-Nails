const WHATSAPP_NUMBER = '584122428674'

export function buildWhatsAppUrl(dia: string, hora: string): string {
  const mensaje = `Hola Rosibel, me interesa una cita el ${dia} a las ${hora}. ¿Está disponible?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
}
