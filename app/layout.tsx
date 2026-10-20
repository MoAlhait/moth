import type { Metadata, Viewport } from 'next'
import { DM_Mono, DM_Sans, DM_Serif_Display } from 'next/font/google'
import { MotionProvider } from '@/components/landing/motion-provider'
import './globals.css'

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-dm-serif',
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
  themeColor: '#111411',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
