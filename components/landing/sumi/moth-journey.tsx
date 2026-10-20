'use client'

import { useEffect, useId, useMemo, useRef } from 'react'
import { mothSvg, MOTH_BOX } from './art'
import { journey } from './journey-store'

/**
 * The moth that leaves the hero lantern and travels down the page with the scroll.
 *
 * Stops are marked in the page with data-moth-anchor and data-moth-order. Each stop gives
 * the landing point as fractions of its box (data-moth-ax / -ay), the moth's size
 * (fraction of the box width, or px above 1.5), its resting angle, and whether it perches
 * there or only passes through (data-moth-kind="pass"). Scroll decides where the moth is
 * headed; it eases toward that target so it trails the page like something alive.
 */

type Stop = { el: HTMLElement; order: number; ax: number; ay: number; size: number; rot: number; pass: boolean; s: number; leave: number }

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

function readStops(): Stop[] {
  const vh = innerHeight
  return [...document.querySelectorAll<HTMLElement>('[data-moth-anchor]')]
    .map((el) => {
      const d = el.dataset
      const r = el.getBoundingClientRect()
      const ay = Number(d.mothAy ?? 0.5)
      // the stop becomes "current" when its landing point reaches a little above mid-screen
      const docY = r.top + scrollY + r.height * ay
      const s = Math.max(0, docY - vh * 0.52)
      // it takes off again once its perch is about to scroll out of view
      const leave = Math.max(0, docY - vh * 0.22)
      return { el, order: Number(d.mothOrder ?? 0), ax: Number(d.mothAx ?? 0.5), ay, size: Number(d.mothSize ?? 64), rot: Number(d.mothRot ?? 0), pass: d.mothKind === 'pass', s, leave }
    })
    .sort((a, b) => a.order - b.order)
}

function pointOf(st: Stop) {
  const r = st.el.getBoundingClientRect()
  const w = st.size <= 1.5 ? st.size * r.width : st.size
  return { x: r.left + r.width * st.ax, y: r.top + r.height * st.ay, w }
}

export function MothJourney() {
  const wrap = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const markup = useMemo(() => mothSvg(`j${uid}`), [uid])

  useEffect(() => {
    const root = wrap.current
    if (!root || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mothEl = root.querySelector<HTMLDivElement>('[data-moth]')!
    const glowEl = root.querySelector<HTMLDivElement>('[data-glow]')!
    const wings = [...root.querySelectorAll<SVGGElement>('[data-wing]')]
    const squash = root.querySelector<SVGGElement>('[data-squash]')!

    let stops = readStops()
    const refresh = () => { stops = readStops() }
    addEventListener('resize', refresh)
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)

    // smoothed state
    let x = 0, y = 0, w = 0, rot = 0, vx = 0, vy = 0, phase = 0, sweep = 1, open = 1, glow = 0
    let placed = false, last = performance.now(), raf = 0, wasFlying = false, touchAt = -1e9

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const sc = scrollY
      // wait for the hero moth to land, unless the reader has already started scrolling
      if ((!journey.heroLanded && sc < 40) || stops.length < 2) { root.style.opacity = '0'; return }

      // which leg of the journey are we on
      let i = 0
      while (i < stops.length - 1 && sc >= stops[i + 1].s) i++
      const a = stops[i], b = stops[Math.min(i + 1, stops.length - 1)]
      const pa = pointOf(a), pb = pointOf(b)
      const span = Math.max(1, b.s - a.s)
      const t = a === b ? 0 : clamp((sc - a.s) / span, 0, 1)
      // stay perched until the perch is leaving the screen, and land just as the next stop arrives
      let dwellStart = a.pass ? 0 : clamp((a.leave - a.s) / span, 0.1, 0.5)
      const dwellEnd = b.pass ? 1 : 0.9
      if (dwellStart > dwellEnd - 0.2) dwellStart = Math.max(0, dwellEnd - 0.2)

      let tx: number, ty: number, tw: number, trot: number, perched: Stop | null = null, u = 0
      if (a === b || t <= dwellStart) {
        tx = pa.x; ty = pa.y; tw = pa.w; trot = a.rot; perched = a.pass ? null : a
      } else if (t >= dwellEnd) {
        tx = pb.x; ty = pb.y; tw = pb.w; trot = b.rot; perched = b.pass ? null : b
      } else {
        u = easeInOutSine((t - dwellStart) / (dwellEnd - dwellStart))
        // an arc between the two stops, bowing to alternate sides, with a little wander
        const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2
        const dx = pb.x - pa.x, dy = pb.y - pa.y, len = Math.hypot(dx, dy) || 1
        const bow = Math.min(180, len * 0.32) * (i % 2 ? 1 : -1)
        const cx = mx + (-dy / len) * bow, cy = my + (dx / len) * bow
        const k = 1 - u
        tx = k * k * pa.x + 2 * k * u * cx + u * u * pb.x + Math.sin(now * 0.0031) * 7 * Math.sin(Math.PI * u)
        ty = k * k * pa.y + 2 * k * u * cy + u * u * pb.y + Math.sin(now * 0.0047 + 1) * 6 * Math.sin(Math.PI * u)
        tw = pa.w + (pb.w - pa.w) * u
        trot = 0
        // in the air it flies with the screen: never further out than the viewport margins
        ty = clamp(ty, innerHeight * 0.12, innerHeight * 0.86)
        tx = clamp(tx, 24, innerWidth - 24)
      }

      if (!placed) { x = tx; y = ty; w = tw; rot = trot; placed = true }
      // ease toward the target so the moth trails the scroll rather than snapping to it
      const ease = 1 - Math.exp(-dt / 0.14)
      const nx = x + (tx - x) * ease, ny = y + (ty - y) * ease
      vx = (nx - x) / Math.max(dt, 1e-3); vy = (ny - y) / Math.max(dt, 1e-3)
      x = nx; y = ny; w += (tw - w) * ease
      const dist = Math.hypot(tx - x, ty - y)
      const flying = !perched || dist > 4
      // head into the direction of travel while flying, settle to the stop's angle when perched
      const heading = Math.hypot(vx, vy) > 40 ? clamp((Math.atan2(vx, -vy) * 180) / Math.PI, -70, 70) : trot
      const targetRot = flying ? heading : trot
      rot += (targetRot - rot) * (1 - Math.exp(-dt / 0.25))

      // hand-off: at the very top, resting on the hero lantern, the painting shows its own moth again
      const atHero = i === 0 && t <= dwellStart && dist < 6
      if (atHero && journey.handedOff) journey.set({ handedOff: false })
      if (!atHero && !journey.handedOff) journey.set({ handedOff: true })
      root.style.opacity = journey.handedOff ? '1' : '0'

      // wings: beat in the air, fold back into a resting triangle when perched, breathe now and then
      if (flying) {
        phase += Math.PI * 2 * 8.5 * dt
        open = 1 - 0.72 * (0.5 - 0.5 * Math.cos(phase))
        sweep += (0 - sweep) * (1 - Math.exp(-dt / 0.12))
      } else {
        open += (1 - open) * (1 - Math.exp(-dt / 0.2))
        const br = (now % 6400) / 6400
        const breath = br < 0.35 ? 0.3 * Math.sin((br / 0.35) * Math.PI) : 0
        sweep += (1 - breath - sweep) * (1 - Math.exp(-dt / 0.45))
      }
      if (wasFlying && !flying) touchAt = now
      wasFlying = flying
      const sq = now - touchAt < 450 ? Math.sin(((now - touchAt) / 450) * Math.PI) : 0
      squash.style.transform = `scale(${(1 + 0.03 * sq).toFixed(3)},${(1 - 0.05 * sq).toFixed(3)})`
      for (const wg of wings) {
        const s = Number(wg.dataset.wing)
        const lift = (1 - open) * 11
        wg.style.transform = `rotate(${(-s * lift + s * 54 * sweep).toFixed(2)}deg) scaleX(${(open * (1 - 0.14 * sweep)).toFixed(3)})`
      }

      // light: a little lantern warmth rides with the moth while it flies
      glow += ((flying ? 1 : 0.25) - glow) * (1 - Math.exp(-dt / 0.3))
      const h = (w * MOTH_BOX.h) / MOTH_BOX.w
      mothEl.style.width = `${w.toFixed(1)}px`
      mothEl.style.height = `${h.toFixed(1)}px`
      mothEl.style.transform = `translate(${(x - w / 2).toFixed(1)}px,${(y - h * 0.525).toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`
      const gs = Math.max(160, w * 3.2)
      glowEl.style.width = glowEl.style.height = `${gs}px`
      glowEl.style.transform = `translate(${(x - gs / 2).toFixed(1)}px,${(y - gs / 2).toFixed(1)}px)`
      glowEl.style.opacity = (glow * 0.55).toFixed(3)

      // light up whatever it is resting on, or about to land on
      for (const st of stops) {
        const lit = st === perched || (st === b && !b.pass && u > 0.7)
        if ((st.el.dataset.lit === '1') !== lit) st.el.dataset.lit = lit ? '1' : '0'
      }
      journey.x = x; journey.y = y; journey.flying = flying
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', refresh); ro.disconnect() }
  }, [markup])

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed inset-0 z-[58] opacity-0">
      <div
        data-glow
        className="absolute top-0 left-0 rounded-full bg-[radial-gradient(closest-side,rgb(240,170,95,0.5),rgb(200,100,40,0.12)_55%,transparent)] mix-blend-screen"
      />
      <div data-moth className="absolute top-0 left-0" style={{ transformOrigin: '50% 52.5%' }} dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  )
}
