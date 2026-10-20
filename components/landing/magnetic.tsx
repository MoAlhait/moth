'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

/** Pulls its child toward the cursor while hovered and springs back on leave. */
export function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={onLeave} className="inline-block">
      {children}
    </motion.div>
  )
}
