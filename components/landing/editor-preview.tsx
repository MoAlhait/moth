'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ease } from './motion-provider'

// pastel syntax colors, same family as the editor in public/moth.html
const k = 'text-rose' // keyword
const f = 'text-lime' // function / name being defined
const s = 'text-amber/90' // string / docstring
const b = 'text-mist' // builtin / constant
const p = 'text-bone-2' // plain

type Tok = [string, string]
const code: Tok[][] = [
  [[k, 'def '], [f, 'reverse'], [p, '(head):']],
  [[s, '    """Reverse a linked list in place.']],
  [],
  [[s, '    >>> to_list(reverse(link([1, 2, 3])))']],
  [[s, '    [3, 2, 1]']],
  [[s, '    """']],
  [[p, '    prev, curr = '], [b, 'None'], [p, ', head']],
  [[k, '    while '], [p, 'curr '], [k, 'is not '], [b, 'None'], [p, ':']],
  [[p, '        nxt = curr.next']],
  [[p, '        curr.next = prev']],
  [[p, '        ']],
]
const ACTIVE = 10

const hint =
  'Nice, you saved curr.next before relinking it. Now the loop needs to make progress. Which two names have to move forward?'

const checkpoints = [
  { label: 'Walk the list with two pointers', done: true },
  { label: 'Save next before relinking', done: true },
  { label: 'Advance prev and curr', done: false },
  { label: 'Return the new head', done: false },
]

export function EditorPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setTyped(hint.length)
      return
    }
    let i = 0
    let id: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      id = setInterval(() => {
        i += 2
        setTyped(Math.min(i, hint.length))
        if (i >= hint.length) clearInterval(id)
      }, 28)
    }, 900)
    return () => {
      clearTimeout(start)
      clearInterval(id)
    }
  }, [inView, reduce])

  return (
    <div
      ref={ref}
      className="glass overflow-hidden rounded-2xl text-left select-none sm:rounded-[1.4rem]"
      role="img"
      aria-label="Moth's editor: a linked list problem on the left, a hint bubble next to the line being written, and a checklist of checkpoints on the right."
    >
      {/* top bar */}
      <div className="flex h-11 items-center justify-between gap-3 border-b border-bone/[0.07] bg-ink-1/70 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex gap-1.5">
            <i className="size-2.5 rounded-full bg-bone/15" />
            <i className="size-2.5 rounded-full bg-bone/15" />
            <i className="size-2.5 rounded-full bg-bone/15" />
          </span>
          <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-bone uppercase">moth</span>
          <span className="truncate font-mono text-[11px] text-bone-3">lab 04 · linked lists</span>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="rounded-full border border-bone/15 bg-ink-2 px-3 py-1 font-mono text-[10px] text-bone-2">
            run doctests
          </span>
          <span className="rounded-full border border-bone/15 bg-ink-2 px-3 py-1 font-mono text-[10px] text-bone-2">
            helper: full
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_17rem]">
        {/* editor */}
        <div className="min-w-0 border-bone/[0.07] md:border-r">
          <div className="flex h-9 items-end gap-5 border-b border-bone/[0.07] bg-ink-1/50 px-4 font-mono text-[11px]">
            <span className="border-b-2 border-lime pb-2 text-lime">q1 reverse</span>
            <span className="pb-2.5 text-bone-3">q2 merge</span>
            <span className="pb-2.5 text-bone-3">q3 cycle</span>
          </div>

          <div className="relative grid grid-cols-[2.75rem_1fr] bg-ink/60 py-3 font-mono text-[11px] leading-[1.9] sm:text-[12.5px]">
            {code.map((line, i) => (
              <div key={i} className="contents">
                <span className="pr-3 text-right text-bone-3/60">{i + 1}</span>
                <span
                  className={`relative overflow-hidden pl-3 whitespace-pre ${i === ACTIVE ? 'bg-bone/[0.04]' : ''}`}
                >
                  {line.map(([cls, text], j) => (
                    <span key={j} className={cls}>
                      {text}
                    </span>
                  ))}
                  {i === ACTIVE && (
                    <span className="inline-block h-[1.1em] w-[2px] translate-y-[0.2em] animate-blink bg-lime" />
                  )}
                </span>
              </div>
            ))}

            {/* line helper bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.8, ease }}
                  className="relative col-span-2 mx-3 mt-2 mb-4 max-w-md rounded-xl border border-lime/35 bg-ink-2/90 p-3.5 font-sans text-[13px] leading-relaxed text-bone shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md sm:mr-6 sm:ml-[4.25rem]"
                >
                  <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-lime uppercase">
                    <span className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-lime/70" />
                      <span className="relative size-1.5 rounded-full bg-lime" />
                    </span>
                    line 11 · on track
                  </div>
                  <p className="min-h-[4.5em] text-bone-2">
                    {hint.slice(0, typed)}
                    {typed < hint.length && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-blink bg-bone-2" />}
                  </p>
                </motion.div>
          </div>
        </div>

        {/* sidebar */}
        <div className="hidden bg-ink-1/40 md:block">
          <div className="flex h-9 items-end gap-4 border-b border-bone/[0.07] px-4 font-mono text-[11px]">
            <span className="border-b-2 border-lime pb-2 text-lime">checkpoints</span>
            <span className="pb-2.5 text-bone-3">ref sheet</span>
            <span className="pb-2.5 text-bone-3">syntax</span>
          </div>
          <ol className="space-y-2 p-4">
            {checkpoints.map((c, i) => (
              <motion.li
                key={c.label}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease }}
                className={`flex items-start gap-3 rounded-lg border p-3 text-[12.5px] ${
                  i === 2 ? 'border-lime/30 bg-lime/[0.06] text-bone' : 'border-bone/[0.06] text-bone-2'
                }`}
              >
                <span
                  className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border text-[9px] ${
                    c.done ? 'border-lime bg-lime text-ink' : i === 2 ? 'border-lime' : 'border-bone/25'
                  }`}
                >
                  {c.done ? '✓' : ''}
                </span>
                <span className={c.done ? 'text-bone-3 line-through decoration-bone-3/40' : ''}>{c.label}</span>
              </motion.li>
            ))}
          </ol>
          <div className="mx-4 mb-4 rounded-lg border border-bone/[0.06] bg-ink/60 p-3 font-mono text-[11px] leading-relaxed">
            <div className="mb-1 text-bone-3"># ref · pointer swap</div>
            <div className="text-bone-2">
              a, b = b, <span className="text-rose">a</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
