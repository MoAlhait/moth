'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ease } from './motion-provider'
import { Reveal, SplitWords } from './reveal'

const steps = [
  {
    n: '01',
    title: 'Paste it in',
    body: 'Drop in a full assignment, type a topic like "linked list practice", or upload a past exam PDF and get a similar problem to work on.',
    tag: 'assignment · topic · pdf',
  },
  {
    n: '02',
    title: 'Get it broken down',
    body: 'Moth pulls each problem into its own tab and lays out checkpoints, so you always know what the next small step is.',
    tag: 'one tab per problem',
  },
  {
    n: '03',
    title: 'Write it yourself',
    body: 'As you type, the line helper reads the line you are on and nudges you with a question, never with the finished code.',
    tag: 'feedback per line',
  },
  {
    n: '04',
    title: 'Run the doctests',
    body: 'Python runs right in your browser through Pyodide, so you can check your work against the doctests without installing anything.',
    tag: 'python · pyodide',
  },
]

function Step({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null)

  return (
    <motion.li
      ref={ref}
      data-moth-anchor={`step-${step.n}`}
      data-moth-order={2 + index}
      data-moth-ax="0.14"
      data-moth-ay="0"
      data-moth-size="64"
      data-moth-rot="-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1, delay: index * 0.05, ease }}
      className="group relative isolate rounded-3xl border border-rice/10 bg-night-2/40 p-7 transition-[border-color,background-color] duration-1000 data-[lit=1]:border-rice/15 data-[lit=1]:bg-night-2/80 sm:p-9"
    >
      {/* light from the moth where it rests on the top edge: a pool inside the panel, a warm
          catch along the rim near it, and a little spill past the edge, all fading with distance */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-[1400ms] group-data-[lit=1]:opacity-100">
        <div className="absolute top-0 left-[14%] size-[34rem] -translate-1/2 animate-[lantern-flicker_4.7s_linear_infinite] rounded-full bg-[radial-gradient(closest-side,rgb(250,190,120,0.13),rgb(230,140,70,0.06)_40%,transparent)]" />
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 animate-[lantern-flicker_4.7s_linear_infinite] bg-[radial-gradient(55%_85%_at_14%_0%,rgb(255,206,140,0.2),rgb(236,150,80,0.08)_38%,transparent_72%)]" />
        </div>
        <div className="absolute -inset-px rounded-3xl border border-transparent [background:radial-gradient(38%_120%_at_14%_0%,rgb(255,200,130,0.75),rgb(240,160,90,0.15)_45%,transparent_70%)_border-box] [mask:linear-gradient(#000_0_0)_padding-box_exclude,linear-gradient(#000_0_0)]" />
      </div>
      <div className="relative mb-10 flex items-center justify-between">
        <span
          className="font-display text-6xl leading-none font-semibold text-rice/15 transition-colors duration-1000 group-data-[lit=1]:text-vermilion"
        >
          {step.n}
        </span>
        <span className="eyebrow">{step.tag}</span>
      </div>
      <h3 className="mb-3 font-display text-2xl font-semibold tracking-[-0.02em] text-rice sm:text-3xl">{step.title}</h3>
      <p className="max-w-md leading-relaxed text-rice-2">{step.body}</p>
    </motion.li>
  )
}

export function Steps() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} id="how" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-32 sm:px-6 sm:py-44">
      <div className="grid gap-16 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="md:sticky md:top-36 md:self-start">
          <Reveal>
            <p className="eyebrow mb-6">How it works</p>
          </Reveal>
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-rice">
            <SplitWords
              inView
              segments={[
                { text: 'From problem set to' },
                { text: 'done,', className: 'text-vermilion' },
                { text: 'one checkpoint at a time.' },
              ]}
            />
          </h2>
          <div className="mt-12 hidden h-[3px] w-full max-w-sm rounded-full bg-rice/10 md:block">
            <motion.div style={{ width: fill }} className="h-[3px] rounded-full bg-vermilion" />
          </div>
        </div>

        <ol className="space-y-5">
          {steps.map((s, i) => (
            <Step key={s.n} step={s} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}
