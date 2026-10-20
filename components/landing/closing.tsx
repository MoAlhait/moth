'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { LaunchLink } from './launch'
import { Magnetic } from './magnetic'
import { Seal } from './sumi/seal'
import { SmallLantern } from './sumi/small-lantern'
import { Reveal, SplitWords } from './reveal'

export function Closing() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [64, 32])
  // the moth gets excited while you hover the button
  const [eager, setEager] = useState(false)

  return (
    <section ref={ref} className="px-4 pb-6 sm:px-6">
      <motion.div
        style={{ scale, borderRadius: radius }}
        className="relative mx-auto max-w-7xl overflow-hidden bg-sumi px-6 py-28 text-center text-cream shadow-[0_50px_100px_-50px_rgb(0_0_0/0.8)] sm:py-40"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-[45%] left-1/2 size-[60rem] -translate-x-1/2 animate-breathe rounded-full bg-[radial-gradient(circle,rgb(232_178_109/0.28),transparent_60%)]" />
          <div className="absolute -top-40 -left-20 size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(184_55_42/0.14),transparent_60%)]" />
        </div>

        {/* the last and smallest lantern, at the left edge: where the moth ends its flight */}
        <SmallLantern anchor="closing" order={8} className="absolute top-0 left-[2%] aspect-square w-28 sm:left-[4%] sm:w-40" />
        <div className="relative">
          <Reveal>
            <Seal className={`mx-auto mb-10 size-14 rounded-lg transition-transform duration-500 ease-expo ${eager ? 'scale-110 -rotate-3' : ''}`} />
          </Reveal>
          <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.6rem,7vw,6.2rem)] leading-[1.04] font-semibold tracking-[-0.03em]">
            <SplitWords
              inView
              segments={[
                { text: 'Your next problem set is' },
                { text: 'waiting.', className: 'text-ochre-2' },
              ]}
            />
          </h2>
          <Reveal delay={0.3} className="mt-12">
            <div className="inline-block" onMouseEnter={() => setEager(true)} onMouseLeave={() => setEager(false)}>
            <Magnetic strength={0.4}>
              <LaunchLink className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-vermilion px-9 py-5 font-mono text-[12px] font-medium tracking-[0.14em] text-night uppercase transition-shadow duration-500 hover:shadow-[0_0_60px_-6px_rgb(232_178_109/0.6)]">
                <span className="absolute inset-0 -translate-x-full bg-vermilion-2 transition-transform duration-700 ease-brush group-hover:translate-x-0" />
                <span className="relative">Open moth</span>
                <span className="relative transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </LaunchLink>
            </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.45}>
            <p className="eyebrow mt-8 !text-cream/50">Python · runs in your browser</p>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
      <a href="#top" className="group flex items-center gap-2.5">
        <Seal className="size-6 rounded transition-transform duration-300 ease-expo group-hover:rotate-[-4deg]" />
        <span className="font-display text-[17px] font-semibold text-rice">moth</span>
      </a>
      <p className="eyebrow">Guided feedback / no answer dumping</p>
      <a
        href="https://mohammad-alhait.com"
        className="eyebrow relative transition-colors hover:text-rice after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-vermilion after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100"
      >
        Made by Mohammad Alhait
      </a>
    </footer>
  )
}
