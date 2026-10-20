'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ease } from './motion-provider'
import { Reveal, SplitWords } from './reveal'

/** Washi card with lantern light that follows the cursor and a soft lift on hover. */
function Card({
  className = '',
  index,
  children,
}: {
  className?: string
  index: number
  children: React.ReactNode
}) {
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, delay: (index % 3) * 0.08, ease }}
      onPointerMove={onMove}
      className={`washi group relative overflow-hidden rounded-3xl p-7 transition-[translate,border-color] duration-500 ease-expo hover:-translate-y-1 hover:border-rice/20 sm:p-8 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgb(232 178 109 / 0.28), transparent 45%)',
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-auto font-display text-xl font-semibold tracking-[-0.02em] text-rice sm:text-2xl">{children}</h3>
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-rice-2">{children}</p>
}

const modes = ['full', 'bottom', 'off'] as const
type Mode = (typeof modes)[number]

/** Live version of the helper scope dropdown in the app: full bubble, bottom bar, or nothing. */
function HelperDemo() {
  const [mode, setMode] = useState<Mode>('full')
  const tip = (
    <>
      Where does <code className="font-mono text-cream">value</code> come from? Look at what the loop on line 7
      actually names each item.
    </>
  )

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="eyebrow">helper</span>
        <div role="radiogroup" aria-label="Helper scope" className="flex rounded-full border border-rice/10 bg-night p-1">
          {modes.map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={`relative rounded-full px-3.5 py-1.5 font-mono text-[11px] transition-colors duration-300 ${
                mode === m ? 'text-night' : 'text-rice-2 hover:text-rice'
              }`}
            >
              {mode === m && (
                <motion.span
                  layoutId="helper-mode"
                  className="absolute inset-0 rounded-full bg-rice"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{m}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-[15.5rem] flex-col overflow-hidden rounded-2xl bg-sumi font-mono text-[12.5px] leading-[1.9]">
        <div className="p-5">
          <div>
            <span className="mr-4 text-cream/30">7</span>
            <span className="text-[#e07a5f]">for</span> <span className="text-cream/80">key</span>{' '}
            <span className="text-[#e07a5f]">in</span> <span className="text-cream/80">counts:</span>
          </div>
          <div>
            <span className="mr-4 text-cream/30">8</span>
            <span className="text-cream/80">{'    '}total += counts[</span>
            <span
              className={`text-cream/80 underline decoration-wavy underline-offset-4 transition-[text-decoration-color] duration-500 ${
                mode === 'off' ? 'decoration-transparent' : 'decoration-ochre-2'
              }`}
            >
              value
            </span>
            <span className="text-cream/80">]</span>
          </div>
          <AnimatePresence mode="popLayout">
            {mode === 'full' && (
              <motion.div
                key="bubble"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.5, ease }}
                className="mt-4 ml-7 max-w-sm rounded-xl border border-ochre/50 bg-sumi-3 p-3 font-sans text-[13px] leading-relaxed text-cream/75"
              >
                <span className="mb-1 block font-mono text-[10px] tracking-[0.14em] text-ochre-2 uppercase">
                  line 8 · check this
                </span>
                {tip}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {mode === 'bottom' && (
            <motion.div
              key="bar"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="mt-auto flex items-start gap-3 border-t border-cream/[0.08] bg-sumi-2 px-5 py-3 font-sans text-[13px] leading-relaxed text-cream/75"
            >
              <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-ochre-2" />
              <span>{tip}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 pb-32 sm:px-6 sm:pb-44">
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-rice">
          <SplitWords
            inView
            segments={[
              { text: 'Everything you need to' },
              { text: 'get unstuck,', className: 'text-vermilion' },
              { text: 'nothing that does it for you.' },
            ]}
          />
        </h2>
        <Reveal delay={0.2} className="eyebrow md:pb-3">
          Features
        </Reveal>
      </div>

      <div className="grid auto-rows-[minmax(17rem,auto)] gap-4 md:grid-cols-6">
        {/* line helper */}
        <Card index={0} className="md:col-span-4 md:row-span-2">
          <HelperDemo />
          <Title>A line helper that reads over your shoulder</Title>
          <Body>
            Feedback lands next to the line you are writing. Set it to full, bottom bar only, or off when you want to
            go quiet.
          </Body>
        </Card>

        {/* doctests */}
        <Card index={1} className="md:col-span-2">
          <div className="mb-8 rounded-xl bg-sumi p-4 font-mono text-[11.5px] leading-relaxed">
            <div className="text-cream/45">$ run doctests</div>
            <div className="text-cream/80">Trying: reverse(link([1, 2]))</div>
            <div className="text-ochre-2">ok</div>
          </div>
          <Title>Doctests in your browser</Title>
          <Body>Python runs locally through Pyodide. Nothing to install.</Body>
        </Card>

        {/* reference sheet */}
        <Card index={2} className="md:col-span-2">
          <div className="mb-8 flex flex-wrap gap-2">
            {['zip', 'enumerate', 'isinstance', 'super()'].map((t) => (
              <span
                key={t}
                className="rounded-full border border-rice/15 bg-night px-3 py-1 font-mono text-[11px] text-indigo transition-colors duration-300 group-hover:border-indigo/40"
              >
                {t}
              </span>
            ))}
          </div>
          <Title>A reference sheet for this problem</Title>
          <Body>The syntax you actually need here, with short examples, one tab away.</Body>
        </Card>

        {/* past exams */}
        <Card index={3} className="md:col-span-3">
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-16 w-13 shrink-0 place-items-center rounded-md border border-rice/15 bg-night font-mono text-[10px] text-vermilion shadow-[0_8px_16px_-10px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-expo group-hover:-rotate-6">
              PDF
            </div>
            <span className="font-display text-3xl font-medium text-rice-3 transition-colors duration-500 group-hover:text-vermilion">
              → similar problem
            </span>
          </div>
          <Title>Practice from past exams</Title>
          <Body>Upload an old exam and moth writes a new problem in the same shape, so you practice the skill and not the answer key.</Body>
        </Card>

        {/* no answers */}
        <Card index={4} className="md:col-span-3">
          <div className="mb-8 font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none font-semibold">
            <span className="text-rice/25 line-through decoration-vermilion decoration-[3px]">answers</span>{' '}
            <span className="text-rice">questions</span>
          </div>
          <Title>Hints, never solutions</Title>
          <Body>Moth is built to coach. It points at the gap in your reasoning and leaves the code to you.</Body>
        </Card>
      </div>
    </section>
  )
}
