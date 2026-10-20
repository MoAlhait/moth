'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
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
  const active = useInView(ref, { margin: '-45% 0px -45% 0px' })

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1, delay: index * 0.05, ease }}
      className={`group relative rounded-3xl border p-7 transition-[border-color,background-color] duration-700 sm:p-9 ${
        active ? 'border-lime/25 bg-ink-2/70' : 'border-bone/[0.07] bg-ink-1/40'
      }`}
    >
      <div className="mb-10 flex items-center justify-between">
        <span
          className={`font-serif text-6xl leading-none italic transition-colors duration-700 ${
            active ? 'text-lime' : 'text-bone/20'
          }`}
        >
          {step.n}
        </span>
        <span className="eyebrow">{step.tag}</span>
      </div>
      <h3 className="mb-3 text-2xl font-medium tracking-[-0.03em] text-bone sm:text-3xl">{step.title}</h3>
      <p className="max-w-md leading-relaxed text-bone-2">{step.body}</p>
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
          <h2 className="text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em]">
            <SplitWords
              inView
              segments={[
                { text: 'From problem set to' },
                { text: 'done,', className: 'font-serif italic font-normal text-lime' },
                { text: 'one checkpoint at a time.' },
              ]}
            />
          </h2>
          <div className="mt-12 hidden h-px w-full max-w-sm bg-bone/10 md:block">
            <motion.div style={{ width: fill }} className="h-px bg-lime" />
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
