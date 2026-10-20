'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { MothMark } from './moth-mark'

type Origin = { x: number; y: number; r: number }

const LaunchContext = createContext<(e: React.MouseEvent<HTMLAnchorElement>) => void>(() => {})

/**
 * Page transition into the app: a lime wipe and then an ink wipe grow out of
 * the clicked button, and the route changes once the screen is covered.
 */
export function LaunchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [origin, setOrigin] = useState<Origin | null>(null)

  useEffect(() => {
    router.prefetch('/moth')
  }, [router])

  const launch = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // let cmd/ctrl/shift-click open a new tab as usual
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      if (origin) return
      if (reduce) {
        router.push('/moth')
        return
      }
      let { clientX: x, clientY: y } = e
      if (x === 0 && y === 0) {
        // keyboard activation has no pointer position, start from the button
        const rect = e.currentTarget.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }
      const w = window.innerWidth
      const h = window.innerHeight
      setOrigin({ x, y, r: Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 40 })
    },
    [origin, reduce, router],
  )

  return (
    <LaunchContext.Provider value={launch}>
      {children}
      <AnimatePresence>
        {origin && (
          <>
            <motion.div
              key="wipe-lime"
              aria-hidden
              className="fixed inset-0 z-[100] bg-lime"
              initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
              animate={{ clipPath: `circle(${origin.r}px at ${origin.x}px ${origin.y}px)` }}
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              key="wipe-ink"
              className="fixed inset-0 z-[101] grid place-items-center bg-ink"
              initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
              animate={{ clipPath: `circle(${origin.r}px at ${origin.x}px ${origin.y}px)` }}
              transition={{ duration: 0.75, delay: 0.14, ease: [0.76, 0, 0.24, 1] }}
              onAnimationComplete={() => router.push('/moth')}
            >
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
              >
                <MothMark className="size-12 animate-pulse" />
                <span className="eyebrow">opening moth</span>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LaunchContext.Provider>
  )
}

/** Link to the app that plays the launch transition. */
export function LaunchLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const launch = useContext(LaunchContext)
  return (
    <a href="/moth" onClick={launch} className={className}>
      {children}
    </a>
  )
}
