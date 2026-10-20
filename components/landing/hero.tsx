'use client'

import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { EditorPreview } from './editor-preview'
import { LaunchLink } from './launch'
import { Magnetic } from './magnetic'
import { ease } from './motion-provider'
import { SplitWords } from './reveal'

const accent = 'font-serif italic font-normal tracking-[-0.02em]'

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  // soft glow that trails the cursor across the hero
  const mx = useSpring(useMotionValue(-400), { stiffness: 60, damping: 20 })
  const my = useSpring(useMotionValue(-400), { stiffness: 60, damping: 20 })
  function onMove(e: React.PointerEvent) {
    const rect = section.current?.getBoundingClientRect()
    if (!rect || e.pointerType !== 'mouse') return
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  // headline drifts up and fades as you scroll past it
  const { scrollYProgress: out } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const headY = useTransform(out, [0, 1], [0, -140])
  const headOpacity = useTransform(out, [0, 0.45], [1, 0])

  // the product shot tilts up flat as it enters
  const { scrollYProgress: inn } = useScroll({ target: stage, offset: ['start end', 'start 0.25'] })
  const rotateX = useTransform(inn, [0, 1], [24, 0])
  const scale = useTransform(inn, [0, 1], [0.86, 1])
  const glow = useTransform(inn, [0, 1], [0.2, 0.9])

  return (
    <section ref={section} id="top" onPointerMove={onMove} className="relative overflow-hidden pt-36 pb-24 sm:pt-44">
      {/* ambient light */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10%] size-[46rem] animate-drift rounded-full bg-rose/20 blur-[120px]" />
        <div className="absolute top-[30%] left-[-15%] size-[40rem] animate-drift-slow rounded-full bg-lime/12 blur-[120px]" />
        <div className="absolute top-[65%] right-[15%] size-[30rem] animate-drift rounded-full bg-mist/10 blur-[120px]" />
        <motion.div
          className="absolute size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.07] blur-[90px]"
          style={{ left: mx, top: my }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(239_238_232/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(239_238_232/0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,black,transparent)]" />
      </div>

      <motion.div style={{ y: headY, opacity: headOpacity }} className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease }}
          className="glass mb-10 inline-flex items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5"
        >
          <span className="flex gap-1 rounded-full bg-ink/70 px-2.5 py-1.5">
            <i className="size-1.5 rounded-full bg-lime" />
            <i className="size-1.5 rounded-full bg-rose" />
            <i className="size-1.5 rounded-full bg-mist" />
          </span>
          <span className="eyebrow text-bone-2">AI coding tutor for CS homework</span>
        </motion.div>

        <h1 className="text-[clamp(3.1rem,11vw,9.75rem)] leading-[0.92] font-medium tracking-[-0.055em] text-bone">
          <SplitWords
            className="block"
            delay={0.35}
            segments={[{ text: 'Paste your' }, { text: 'homework.', className: `${accent} text-lime` }]}
          />
          <SplitWords
            className="block"
            delay={0.6}
            segments={[{ text: 'Keep' }, { text: 'thinking.', className: `${accent} text-rose` }]}
          />
        </h1>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.05, duration: 1, ease }}
            className="max-w-md text-[17px] leading-relaxed text-bone-2"
          >
            Paste any assignment, or ask for a topic like inheritance to get a fresh practice problem. Moth coaches
            you checkpoint by checkpoint and never hands you the answer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <LaunchLink className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-lime py-4 pr-4 pl-7 font-mono text-[12px] font-medium tracking-[0.14em] text-ink uppercase shadow-[0_0_0_0_rgb(200_214_109/0.5)] transition-shadow duration-500 hover:shadow-[0_0_48px_-6px_rgb(200_214_109/0.6)]">
                <span className="relative">Start a session</span>
                <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-ink text-lime">
                  <span className="transition-transform duration-500 ease-expo group-hover:translate-x-6 group-hover:-translate-y-6">
                    ↗
                  </span>
                  <span className="absolute -translate-x-6 translate-y-6 transition-transform duration-500 ease-expo group-hover:translate-x-0 group-hover:translate-y-0">
                    ↗
                  </span>
                </span>
              </LaunchLink>
            </Magnetic>
            <a
              href="#how"
              className="group inline-flex items-center gap-2 rounded-full px-5 py-4 font-mono text-[12px] tracking-[0.14em] text-bone-2 uppercase transition-colors hover:text-bone"
            >
              How it works
              <span className="transition-transform duration-500 ease-expo group-hover:translate-y-1">↓</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      <div ref={stage} className="relative mx-auto mt-24 max-w-6xl px-4 [perspective:1600px] sm:mt-28 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1.4, ease }}
        >
          <motion.div style={{ rotateX, scale, transformOrigin: '50% 0%' }} className="relative">
            <motion.div
              aria-hidden
              style={{ opacity: glow }}
              className="absolute -inset-x-10 -top-16 -bottom-10 -z-10 rounded-[3rem] bg-[radial-gradient(60%_50%_at_50%_0%,rgb(200_214_109/0.22),transparent_70%)] blur-2xl"
            />
            <EditorPreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
