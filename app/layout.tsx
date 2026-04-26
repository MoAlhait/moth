import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'moth',
  description: 'AI homework helper — paste CS homework and work through it step by step.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
