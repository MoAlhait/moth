'use client'

import { MotionConfig } from 'framer-motion'

export const ease = [0.16, 1, 0.3, 1] as const

/** Honors the OS reduced-motion setting for every motion component on the site. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease }}>
      {children}
    </MotionConfig>
  )
}
