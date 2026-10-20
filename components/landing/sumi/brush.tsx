'use client'

import { motion } from 'framer-motion'
import { useId } from 'react'

/**
 * A single dry-brush stroke, drawn left to right when it scrolls into view.
 * Used for underlines and section rules.
 */
export function BrushStroke({
  className,
  color = 'var(--color-vermilion)',
  delay = 0,
  variant = 'swash',
}: {
  className?: string
  color?: string
  delay?: number
  variant?: 'swash' | 'rule'
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  // a closed stroke shape: heavy where the brush lands, thinning and breaking as it lifts
  const d =
    variant === 'swash'
      ? 'M2 9.5C30 6 70 4.4 120 4.6c40 .2 70 1.8 96 4.2 1.8.6 1.6 2.2-.4 2.4-28-1.2-60-1.8-98-1.4C74 10.2 38 12 6 14.6c-3 .2-5.4-4.4-4-5.1z'
      : 'M1 6.2C60 4.6 140 4.4 218 5.4c1.4.2 1.4 1.6 0 1.8C140 8 60 8.2 1.6 7.6.6 7.4.4 6.4 1 6.2z'
  return (
    <svg viewBox="0 0 220 16" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <filter id={`b${id}`} x="-5%" y="-40%" width="110%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8 .25" numOctaves="2" seed="21" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.5" result="m" />
          <feTurbulence type="fractalNoise" baseFrequency=".4" numOctaves="2" seed="6" result="w" />
          <feDisplacementMap in="SourceGraphic" in2="w" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        <clipPath id={`c${id}`}>
          <motion.rect
            x="0"
            y="0"
            height="16"
            initial={{ width: 0 }}
            whileInView={{ width: 220 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ delay, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          />
        </clipPath>
      </defs>
      <path d={d} fill={color} filter={`url(#b${id})`} clipPath={`url(#c${id})`} />
    </svg>
  )
}
