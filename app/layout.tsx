import type { Metadata, Viewport } from 'next'
import { DM_Mono, DM_Sans, Shippori_Mincho } from 'next/font/google'
import { MotionProvider } from '@/components/landing/motion-provider'
import './globals.css'

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const mincho = Shippori_Mincho({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-mincho',
  display: 'swap',
})
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'moth · the AI coding tutor that never hands you the answer',
  description: 'Paste your CS homework and work through it checkpoint by checkpoint, with feedback on the line you are writing.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0e0c0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mincho.variable} ${mono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
