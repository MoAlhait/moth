'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

const words: { w: string; c?: string }[] = [
  ...'Most AI tools hand you the'.split(' ').map((w) => ({ w })),
  { w: 'answer', c: 'font-serif italic font-normal text-rose' },
  ...'and the learning walks out the door. Moth asks the next question instead, so the'
    .split(' ')
    .map((w) => ({ w })),
  { w: 'thinking', c: 'font-serif italic font-normal text-lime' },
  ...'stays yours.'.split(' ').map((w) => ({ w })),
]

function Word({ progress, range, children, className }: {
  progress: MotionValue<number>
  range: [number, number]
  children: string
  className?: string
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const y = useTransform(progress, range, [6, 0])
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${className ?? ''}`}>
      {children}
    </motion.span>
  )
}

/** Statement that lights up word by word as you scroll through it. */
export function Principle() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })

  return (
    <section id="principle" className="relative scroll-mt-24 overflow-hidden px-4 pt-10 pb-32 sm:px-6 sm:pt-16 sm:pb-44">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(200_134_120/0.12),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-5xl">
        <p className="eyebrow mb-10">The principle</p>
        <p
          ref={ref}
          className="text-[clamp(2rem,5vw,4.25rem)] leading-[1.08] font-medium tracking-[-0.04em] text-bone"
        >
          <span className="sr-only">{words.map((x) => x.w).join(' ')}</span>
          <span aria-hidden>
            {words.map(({ w, c }, i) => {
              const start = i / words.length
              return (
                <span key={i}>
                  <Word progress={scrollYProgress} range={[start, start + 1 / words.length]} className={c}>
                    {w}
                  </Word>{' '}
                </span>
              )
            })}
          </span>
        </p>
      </div>
    </section>
  )
}
