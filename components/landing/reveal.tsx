'use client'

import { motion, type Variants } from 'framer-motion'
import { ease } from './motion-provider'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'p' | 'li' | 'span' | 'h2' | 'h3'
}

/** Fades, lifts and un-blurs its children the first time they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 28, as = 'div' }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </Tag>
  )
}

const line: Variants = {
  hidden: {},
  show: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: stagger, delayChildren: delay },
  }),
}

const word: Variants = {
  hidden: { y: '110%', rotate: 4 },
  show: { y: '0%', rotate: 0, transition: { duration: 1.1, ease } },
}

export type Segment = { text: string; className?: string }

/**
 * Splits text into words that rise out of a clipped line, one after another.
 * Pass segments to style individual phrases (e.g. the serif italic accents).
 */
export function SplitWords({
  segments,
  className,
  stagger = 0.06,
  delay = 0,
  inView = false,
}: {
  segments: Segment[]
  className?: string
  stagger?: number
  delay?: number
  inView?: boolean
}) {
  const words = segments.flatMap((seg) =>
    seg.text
      .split(' ')
      .filter(Boolean)
      .map((w) => ({ w, className: seg.className })),
  )
  const trigger = inView
    ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { animate: 'show' }

  return (
    <motion.span
      className={className}
      variants={line}
      custom={{ stagger, delay }}
      initial="hidden"
      {...trigger}
    >
      <span className="sr-only">{segments.map((s) => s.text).join(' ')}</span>
      {words.map(({ w, className: wc }, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span variants={word} className={`inline-block origin-bottom-left ${wc ?? ''}`}>
            {w}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  )
}
