'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { journey } from './sumi/journey-store'

const words: { w: string; c?: string }[] = [
  ...'Most AI tools hand you the'.split(' ').map((w) => ({ w })),
  { w: 'answer', c: 'text-vermilion' },
  ...'and the learning walks out the door. Moth asks the next question instead, so the'
    .split(' ')
    .map((w) => ({ w })),
  { w: 'thinking', c: 'text-rice underline decoration-ochre-2/70 decoration-[0.12em] underline-offset-[0.14em]' },
  ...'stays yours.'.split(' ').map((w) => ({ w })),
]

function Word({ progress, range, children, className }: {
  progress: MotionValue<number>
  range: [number, number]
  children: string
  className?: string
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const y = useTransform(progress, range, [6, 0])
  return (
    <motion.span style={{ opacity: 1, y }} className="relative inline-block">
      <motion.span style={{ opacity }} className={`inline-block ${className ?? ''}`}>
        {children}
      </motion.span>
      {/* lantern light the passing moth leaves on the word for a moment */}
      <span data-word-glow aria-hidden className="absolute inset-0 text-ochre-2 opacity-0 [text-shadow:0_0_14px_rgb(240_170_95/0.3)]">
        {children}
      </span>
    </motion.span>
  )
}

/** Statement that lights up word by word as you scroll through it. */
export function Principle() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })

  // as the moth crosses the paragraph, words near it flare up and fade out behind it
  useEffect(() => {
    const p = ref.current
    if (!p) return
    const glows = [...p.querySelectorAll<HTMLElement>('[data-word-glow]')]
    const level = new Float32Array(glows.length)
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const box = p.getBoundingClientRect()
      const near = journey.flying && journey.y > box.top - 80 && journey.y < box.bottom + 80
      glows.forEach((g, i) => {
        let target = 0
        if (near) {
          const r = g.getBoundingClientRect()
          const d = Math.hypot(r.left + r.width / 2 - journey.x, r.top + r.height / 2 - journey.y)
          target = Math.max(0, 1 - d / 110) * 0.55
        }
        // rise quickly as it passes, fade slowly once it has gone
        level[i] = target > level[i] ? level[i] + (target - level[i]) * 0.35 : level[i] * 0.94
        g.style.opacity = level[i] < 0.01 ? '0' : level[i].toFixed(3)
      })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section id="principle" className="relative scroll-mt-24 overflow-hidden px-4 pt-10 pb-32 sm:px-6 sm:pt-16 sm:pb-44">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(232_178_109/0.22),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-5xl">
        {/* the moth's path crosses the paragraph from right to left */}
        <span aria-hidden data-moth-anchor="principle-a" data-moth-order="6" data-moth-kind="pass" data-moth-size="56" className="absolute top-[34%] right-[2%] size-px" />
        <span aria-hidden data-moth-anchor="principle-b" data-moth-order="7" data-moth-kind="pass" data-moth-size="52" className="absolute top-[78%] left-[4%] size-px" />
        <p className="eyebrow mb-10">The principle</p>
        <p
          ref={ref}
          className="font-display text-[clamp(2rem,4.8vw,4rem)] leading-[1.18] font-semibold tracking-[-0.025em] text-rice"
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
