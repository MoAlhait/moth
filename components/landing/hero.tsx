'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { EditorPreview } from './editor-preview'
import { LaunchLink } from './launch'
import { Magnetic } from './magnetic'
import { ease } from './motion-provider'
import { SplitWords } from './reveal'
import { BrushStroke } from './sumi/brush'
import { Seal } from './sumi/seal'
import { SmallLantern } from './sumi/small-lantern'
import { SumiLantern } from './sumi/sumi-lantern'

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  // headline drifts up and fades as you scroll past it
  const { scrollYProgress: out } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const headY = useTransform(out, [0, 1], [0, -120])
  const headOpacity = useTransform(out, [0, 0.45], [1, 0])

  // the editor rises flat as it enters
  const { scrollYProgress: inn } = useScroll({ target: stage, offset: ['start end', 'start 0.25'] })
  const rotateX = useTransform(inn, [0, 1], [18, 0])
  const scale = useTransform(inn, [0, 1], [0.9, 1])

  return (
    <section ref={section} id="top" className="relative overflow-hidden pt-32 pb-48 sm:pt-40 sm:pb-56">
      {/* warm light pooling on the paper behind the scroll, and a faint cool wash opposite */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-6%] right-[-14%] size-[60rem] animate-breathe rounded-full bg-[radial-gradient(closest-side,rgb(240,160,80,0.26),rgb(200,90,40,0.08)_55%,transparent)] blur-2xl" />
        <div className="absolute top-[8%] left-[18%] size-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(240,189,118,0.06),transparent)] blur-3xl" />
      </div>

      <motion.div
        style={{ y: headY, opacity: headOpacity }}
        className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 md:grid-cols-[1.12fr_0.88fr] md:gap-12"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease }}
            className="mb-9 inline-flex items-center gap-3"
          >
            <Seal className="size-6 rounded-[3px]" />
            <span className="eyebrow">An AI tutor for CS homework</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.9rem,7vw,6.4rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-rice">
            <SplitWords className="block" delay={0.35} segments={[{ text: 'Paste your' }, { text: 'homework.', className: 'text-vermilion' }]} />
            <span className="block">
              <SplitWords delay={0.6} segments={[{ text: 'Keep' }]} />{' '}
              {/* the brush underline belongs to this word, wherever the line wraps */}
              <span className="relative inline-block">
                <SplitWords delay={0.7} segments={[{ text: 'thinking.' }]} />
                <BrushStroke
                  className="absolute -bottom-[0.04em] left-[-0.05em] h-[0.22em] w-[104%] opacity-85"
                  color="var(--color-ochre-2)"
                  delay={1.3}
                />
              </span>
            </span>
          </h1>

          <div className="mt-9 flex flex-col gap-9">
            <motion.p
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1.05, duration: 1, ease }}
              className="max-w-md text-[17px] leading-relaxed text-rice-2"
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
                <LaunchLink className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-rice py-4 pr-4 pl-7 font-mono text-[12px] font-medium tracking-[0.14em] text-night uppercase shadow-[0_0_40px_-10px_rgb(240_189_118/0.35)]">
                  <span className="absolute inset-0 -translate-x-full bg-vermilion transition-transform duration-700 ease-brush group-hover:translate-x-0" />
                  <span className="relative">Start a session</span>
                  <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-night text-rice">
                    <span className="transition-transform duration-500 ease-expo group-hover:translate-x-6 group-hover:-translate-y-6">↗</span>
                    <span className="absolute -translate-x-6 translate-y-6 transition-transform duration-500 ease-expo group-hover:translate-x-0 group-hover:translate-y-0">↗</span>
                  </span>
                </LaunchLink>
              </Magnetic>
              <a
                href="#how"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-4 font-mono text-[12px] tracking-[0.14em] text-rice-2 uppercase transition-colors hover:text-rice"
              >
                How it works
                <span className="transition-transform duration-500 ease-expo group-hover:translate-y-1">↓</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* the logo painting, with no frame: the lantern hangs in the page and lights it */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 2.2, ease }}
          className="relative mx-auto w-full max-w-[30rem] md:-my-16 md:-mr-24 md:w-[125%] md:max-w-none"
        >
          <SumiLantern
            data-moth-anchor="hero"
            data-moth-order="0"
            data-moth-ax="0.70"
            data-moth-ay="0.41"
            data-moth-size="0.416"
            data-moth-rot="-14"
            startDelay={1600}
            className="aspect-square w-full cursor-pointer [mask-image:radial-gradient(closest-side,black_62%,transparent)]"
          />
        </motion.figure>
      </motion.div>

      <div ref={stage} className="relative mx-auto mt-28 max-w-6xl px-4 [perspective:1600px] sm:px-6">
        <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1.4, ease }}>
          <motion.div style={{ rotateX, scale, transformOrigin: '50% 0%' }} className="relative">
            <EditorPreview />
            {/* a smaller lantern hangs from the bottom of the demo: the moth's first stop */}
            <SmallLantern anchor="demo" order={1} className="absolute top-full right-[6%] -mt-1 aspect-square w-40 sm:w-52" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
