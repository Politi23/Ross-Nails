import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'R Studio Nails by Rosibel',
  description: 'Reserva tu cita de nail art con Rosibel en Puerto Cabello, Venezuela. Servicios de uñas en salón y a domicilio.',
  metadataBase: new URL('https://ross-nails.vercel.app'),
  openGraph: {
    title: 'R Studio Nails by Rosibel',
    description: 'Reserva tu cita de nail art en Puerto Cabello, Venezuela. Servicios en salón y a domicilio.',
    url: 'https://ross-nails.vercel.app',
    siteName: 'R Studio Nails by Rosibel',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512, alt: 'R Studio Nails logo' }],
    locale: 'es_VE',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'R Studio Nails by Rosibel',
    description: 'Reserva tu cita de nail art en Puerto Cabello, Venezuela.',
    images: ['/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/site.webmanifest',
  themeColor: '#111418',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
