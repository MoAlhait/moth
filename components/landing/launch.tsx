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
        {/*
          Real circles grown with a scale transform, centered on the click. An animated
          clip-path looks the same in code but Chrome composites it at the wrong
          position on retina screens, so the wipe started away from the cursor.
        */}
        {origin && (
          <motion.div key="wipe" className="fixed inset-0 z-[100] overflow-hidden">
            {(['bg-lime', 'bg-ink'] as const).map((bg, i) => (
              <motion.div
                key={bg}
                aria-hidden
                className={`absolute rounded-full ${bg}`}
                style={{
                  left: origin.x - origin.r,
                  top: origin.y - origin.r,
                  width: origin.r * 2,
                  height: origin.r * 2,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.75, delay: i * 0.14, ease: [0.76, 0, 0.24, 1] }}
                onAnimationComplete={i === 1 ? () => router.push('/moth') : undefined}
              />
            ))}
            <motion.div
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <div className="flex flex-col items-center gap-4">
                <MothMark className="size-12 animate-pulse" />
                <span className="eyebrow">opening moth</span>
              </div>
            </motion.div>
          </motion.div>
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
