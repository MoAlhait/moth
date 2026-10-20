'use client'

import { useEffect, useId, useMemo, useRef } from 'react'
import { sumiPaintingSvg } from './art'
import { journey } from './journey-store'
import { apply, bind, createSim, step, T_TOUCH } from './motion'

/**
 * The logo painting: a moth flutters in, alights on a hanging paper lantern, and the
 * lantern sways under its weight. Plays when scrolled into view, pauses offscreen,
 * replays on click, and shows the landed moment to people who prefer reduced motion.
 */
export function SumiLantern({ className, startDelay = 0, ...rest }: { className?: string; startDelay?: number } & React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>) {
  const ref = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const markup = useMemo(() => sumiPaintingSvg(`p${uid}`), [uid])

  useEffect(() => {
    const root = ref.current
    const svg = root?.querySelector('svg')
    if (!root || !svg) return
    const els = bind(svg)
    // once the page moth takes over, this painting's moth steps aside (and comes back on return)
    const show = (pose: ReturnType<typeof step>) => {
      apply(els, pose)
      if (sim.t >= T_TOUCH && !journey.heroLanded) journey.set({ heroLanded: true })
      if (journey.handedOff) els.fly.style.opacity = '0'
    }
    const onJourney = () => { if (journey.handedOff) els.fly.style.opacity = '0' }
    journey.listeners.add(onJourney)
    let sim = createSim(), last: number | null = null, raf = 0, running = false

    const hold = process.env.NODE_ENV !== 'production' ? new URLSearchParams(location.search).get('moth') : null
    if (hold != null) {
      let pose = step(sim, 0)
      while (sim.t < +hold) pose = step(sim, 1000 / 120)
      show(pose)
      return () => { journey.listeners.delete(onJourney) }
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // jump straight to the moth at rest on the lantern
      let pose = step(sim, 0)
      while (sim.t < 9000) pose = step(sim, 1000 / 60)
      show(pose)
      return () => { journey.listeners.delete(onJourney) }
    }

    // hand-drawn boil: like frame-by-frame animation, the brush edges are redrawn a few times a
    // second, so cycle the noise behind every displaced edge through three takes on a stepped beat
    const boilers = [...svg.querySelectorAll<SVGFETurbulenceElement>('filter feTurbulence')]
      .filter((t) => t.parentElement?.querySelector('feDisplacementMap'))
      .map((t) => ({ t, seed: Number(t.getAttribute('seed') ?? 0) }))
    let take = 0, lastBoil = 0
    const boil = (now: number) => {
      if (now - lastBoil < 125) return
      lastBoil = now; take = (take + 1) % 3
      for (const b of boilers) b.t.setAttribute('seed', String(b.seed + take * 7))
    }

    const startAt = performance.now() + startDelay
    const loop = (now: number) => {
      // hold the first frame until the delay is up (e.g. while the scroll unrolls)
      boil(now)
      if (now < startAt) { raf = requestAnimationFrame(loop); return }
      if (last == null) last = now
      const dt = Math.min(50, now - last)
      last = now
      show(step(sim, dt))
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) { running = true; last = null; raf = requestAnimationFrame(loop) }
        else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
      },
      { threshold: 0.3 },
    )
    io.observe(root)
    const replay = () => { sim = createSim(); last = null }
    root.addEventListener('click', replay)
    return () => { io.disconnect(); cancelAnimationFrame(raf); root.removeEventListener('click', replay); journey.listeners.delete(onJourney) }
  }, [markup, startDelay])

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label="Ink painting of a moth fluttering in and landing on a hanging paper lantern"
      title="Click to replay"
      dangerouslySetInnerHTML={{ __html: markup }}
      {...rest}
    />
  )
}
