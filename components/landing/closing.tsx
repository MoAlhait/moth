'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { LaunchLink } from './launch'
import { Magnetic } from './magnetic'
import { MothMark } from './moth-mark'
import { Reveal, SplitWords } from './reveal'

export function Closing() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [64, 32])

  return (
    <section ref={ref} className="px-4 pb-6 sm:px-6">
      <motion.div
        style={{ scale, borderRadius: radius }}
        className="relative mx-auto max-w-7xl overflow-hidden border border-bone/[0.08] bg-ink-1 px-6 py-28 text-center sm:py-40"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-1/2 left-1/2 size-[60rem] -translate-x-1/2 animate-drift rounded-full bg-[radial-gradient(circle,rgb(200_214_109/0.18),transparent_60%)]" />
          <div className="absolute -top-40 -left-20 size-[30rem] animate-drift-slow rounded-full bg-[radial-gradient(circle,rgb(157_187_192/0.12),transparent_60%)]" />
        </div>

        <div className="relative">
          <Reveal>
            <MothMark className="mx-auto mb-10 h-8 w-auto" />
          </Reveal>
          <h2 className="mx-auto max-w-4xl text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] font-medium tracking-[-0.05em]">
            <SplitWords
              inView
              segments={[
                { text: 'Your next problem set is' },
                { text: 'waiting.', className: 'font-serif italic font-normal text-lime' },
              ]}
            />
          </h2>
          <Reveal delay={0.3} className="mt-12">
            <Magnetic strength={0.4}>
              <LaunchLink className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-lime px-9 py-5 font-mono text-[12px] font-medium tracking-[0.14em] text-ink uppercase transition-shadow duration-500 hover:shadow-[0_0_60px_-6px_rgb(200_214_109/0.65)]">
                <span className="absolute inset-0 -translate-x-full bg-lime-2 transition-transform duration-700 ease-expo group-hover:translate-x-0" />
                <span className="relative">Open moth</span>
                <span className="relative transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </LaunchLink>
            </Magnetic>
          </Reveal>
          <Reveal delay={0.45}>
            <p className="eyebrow mt-8">Python · runs in your browser</p>
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
        <MothMark className="h-4 w-auto transition-transform duration-500 ease-expo group-hover:-rotate-12" />
        <span className="text-sm font-semibold tracking-[-0.02em]">moth</span>
      </a>
      <p className="eyebrow">Guided feedback / no answer dumping</p>
      <a
        href="https://mohammad-alhait.com"
        className="eyebrow relative transition-colors hover:text-bone after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-lime after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100"
      >
        Made by Mohammad Alhait
      </a>
    </footer>
  )
}
