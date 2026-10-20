'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ease } from './motion-provider'
import { Reveal, SplitWords } from './reveal'

/** Glass card with a light that follows the cursor and a soft lift on hover. */
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
      className={`glass group relative overflow-hidden rounded-3xl p-7 transition-[translate,border-color] duration-500 ease-expo hover:-translate-y-1 hover:border-bone/20 sm:p-8 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgb(200 214 109 / 0.10), transparent 45%)',
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-auto text-xl font-medium tracking-[-0.025em] text-bone sm:text-2xl">{children}</h3>
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 max-w-sm text-[14.5px] leading-relaxed text-bone-2">{children}</p>
}

const modes = ['full', 'bottom', 'off'] as const
type Mode = (typeof modes)[number]

/** Live version of the helper scope dropdown in the app: full bubble, bottom bar, or nothing. */
function HelperDemo() {
  const [mode, setMode] = useState<Mode>('full')
  const tip = (
    <>
      Where does <code className="font-mono text-bone">value</code> come from? Look at what the loop on line 7
      actually names each item.
    </>
  )

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="eyebrow">helper</span>
        <div role="radiogroup" aria-label="Helper scope" className="flex rounded-full border border-bone/10 bg-ink/70 p-1">
          {modes.map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={`relative rounded-full px-3.5 py-1.5 font-mono text-[11px] transition-colors duration-300 ${
                mode === m ? 'text-ink' : 'text-bone-2 hover:text-bone'
              }`}
            >
              {mode === m && (
                <motion.span
                  layoutId="helper-mode"
                  className="absolute inset-0 rounded-full bg-lime"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{m}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-[15.5rem] flex-col overflow-hidden rounded-2xl border border-bone/[0.07] bg-ink/70 font-mono text-[12.5px] leading-[1.9]">
        <div className="p-5">
          <div>
            <span className="mr-4 text-bone-3/50">7</span>
            <span className="text-rose">for</span> <span className="text-bone-2">key</span>{' '}
            <span className="text-rose">in</span> <span className="text-bone-2">counts:</span>
          </div>
          <div>
            <span className="mr-4 text-bone-3/50">8</span>
            <span className="text-bone-2">{'    '}total += counts[</span>
            <span
              className={`text-bone-2 underline decoration-wavy underline-offset-4 transition-[text-decoration-color] duration-500 ${
                mode === 'off' ? 'decoration-transparent' : 'decoration-amber'
              }`}
            >
              value
            </span>
            <span className="text-bone-2">]</span>
          </div>
          <AnimatePresence mode="popLayout">
            {mode === 'full' && (
              <motion.div
                key="bubble"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.5, ease }}
                className="mt-4 ml-7 max-w-sm rounded-xl border border-amber/40 bg-ink-2 p-3 font-sans text-[13px] leading-relaxed text-bone-2"
              >
                <span className="mb-1 block font-mono text-[10px] tracking-[0.14em] text-amber uppercase">
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
              className="mt-auto flex items-start gap-3 border-t border-bone/[0.07] bg-ink-1 px-5 py-3 font-sans text-[13px] leading-relaxed text-bone-2"
            >
              <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-amber" />
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
        <h2 className="max-w-2xl text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.045em]">
          <SplitWords
            inView
            segments={[
              { text: 'Everything you need to' },
              { text: 'get unstuck,', className: 'font-serif italic font-normal text-rose' },
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
          <div className="mb-8 rounded-xl border border-bone/[0.07] bg-ink/70 p-4 font-mono text-[11.5px] leading-relaxed">
            <div className="text-bone-3">$ run doctests</div>
            <div className="text-bone-2">Trying: reverse(link([1, 2]))</div>
            <div className="text-lime">ok</div>
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
                className="rounded-full border border-bone/10 bg-ink/60 px-3 py-1 font-mono text-[11px] text-mist transition-colors duration-300 group-hover:border-mist/30"
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
            <div className="grid h-16 w-13 shrink-0 place-items-center rounded-md border border-bone/15 bg-ink-2 font-mono text-[10px] text-rose transition-transform duration-500 ease-expo group-hover:-rotate-6">
              PDF
            </div>
            <span className="font-serif text-3xl text-bone-3 italic transition-colors duration-500 group-hover:text-lime">
              → similar problem
            </span>
          </div>
          <Title>Practice from past exams</Title>
          <Body>Upload an old exam and moth writes a new problem in the same shape, so you practice the skill and not the answer key.</Body>
        </Card>

        {/* no answers */}
        <Card index={4} className="md:col-span-3">
          <div className="mb-8 font-serif text-[clamp(2.5rem,5vw,3.5rem)] leading-none italic">
            <span className="text-bone/25 line-through decoration-rose decoration-2">answers</span>{' '}
            <span className="text-lime">questions</span>
          </div>
          <Title>Hints, never solutions</Title>
          <Body>Moth is built to coach. It points at the gap in your reasoning and leaves the code to you.</Body>
        </Card>
      </div>
    </section>
  )
}
