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
 * there or only passes through (data-moth-kind="pass"). It rests until another perch is on
 * screen with room to land, then flies there in one go, so it is never left hovering.
 */

type Stop = { el: HTMLElement; order: number; ax: number; ay: number; size: number; rot: number; pass: boolean }

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

function readStops(): Stop[] {
  return [...document.querySelectorAll<HTMLElement>('[data-moth-anchor]')]
    .map((el) => {
      const d = el.dataset
      return { el, order: Number(d.mothOrder ?? 0), ax: Number(d.mothAx ?? 0.5), ay: Number(d.mothAy ?? 0.5), size: Number(d.mothSize ?? 64), rot: Number(d.mothRot ?? 0), pass: d.mothKind === 'pass' }
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

    // perch and fly: the moth sits on stop `cur` until another stop is on screen with room to
    // land, then makes one whole flight there on its own clock. It never hangs in the air.
    type Pt = { x: number; y: number }
    let cur = 0
    let flight: null | { to: number; t0: number; dur: number; route: Pt[]; w0: number } = null
    const BAND_TOP = 0.16, BAND_BOT = 0.82

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const sc = scrollY, vh = innerHeight
      // wait for the hero moth to land, unless the reader has already started scrolling
      if ((!journey.heroLanded && sc < 40) || stops.length < 2) { root.style.opacity = '0'; return }

      const pts = stops.map(pointOf)
      // room to land: the landing point sits comfortably inside the screen, not at an edge
      // at the very bottom of the page the last perch can't scroll any lower, so it may sit nearer the top
      const atEnd = sc >= document.documentElement.scrollHeight - vh - 4
      const roomy = (i: number) => pts[i].y > (atEnd ? 40 : vh * BAND_TOP) && pts[i].y < vh * BAND_BOT && pts[i].x > 30 && pts[i].x < innerWidth - 30

      if (!flight) {
        // where it would like to be: the stop with room to land nearest the middle of the screen
        let best = -1, bestD = Infinity
        stops.forEach((st, i) => {
          if (st.pass || !roomy(i)) return
          const d = Math.abs(pts[i].y - vh * 0.5)
          if (d < bestD) { bestD = d; best = i }
        })
        const curD = roomy(cur) ? Math.abs(pts[cur].y - vh * 0.5) : Infinity
        // a page opened partway down starts with the moth already resting where you are
        if (!placed && best >= 0) cur = best
        else if (best >= 0 && best !== cur && bestD + vh * 0.12 < curD) {
          // take off; if the principle text lies on the way and is on screen, cross over it
          // a perch that has scrolled far away launches it from just past the screen edge, so it
          // glides in at its normal pace instead of streaking across thousands of pixels
          const from = { x, y: clamp(y, -80, vh + 80) + sc }, toY = pts[best].y + sc
          y = from.y - sc
          const down = toY > from.y
          const via = stops
            .map((st, i) => ({ st, i }))
            .filter(({ st, i }) => st.pass && pts[i].y > -vh * 0.1 && pts[i].y < vh * 1.1 && (pts[i].y + sc - from.y) * (pts[i].y + sc - toY) < 0)
            .sort((p, q) => (down ? p.st.order - q.st.order : q.st.order - p.st.order))
            .map(({ i }) => ({ x: pts[i].x, y: pts[i].y + sc }))
          const dist = Math.hypot(pts[best].x - x, pts[best].y - y) + via.length * 240
          flight = { to: best, t0: now, dur: clamp(dist / 520, 0.8, 2.6) * 1000, route: [from, ...via], w0: w }
        }
      }

      let tx: number, ty: number, tw: number, trot: number, perched: Stop | null = null, u = 0
      if (flight) {
        const target = pts[flight.to]
        // take-off and waypoints are fixed in the page; the destination is live as the page moves
        const nodes = [...flight.route.map((p) => ({ x: p.x, y: p.y - sc })), { x: target.x, y: target.y }]
        u = easeInOutSine(clamp((now - flight.t0) / flight.dur, 0, 1))
        const legs = nodes.length - 1, f = u * legs, k = Math.min(legs - 1, Math.floor(f)), lt = f - k
        const p0 = nodes[k], p1 = nodes[k + 1]
        const dx = p1.x - p0.x, dy = p1.y - p0.y, len = Math.hypot(dx, dy) || 1
        // each leg bows into a soft arc, with a little wander so it never flies a ruler line
        const bow = Math.min(150, len * 0.3) * (flight.to % 2 ? 1 : -1) * (legs === 1 ? 1 : 0.45)
        const cx = (p0.x + p1.x) / 2 + (-dy / len) * bow, cy = (p0.y + p1.y) / 2 + (dx / len) * bow
        const q = 1 - lt
        tx = q * q * p0.x + 2 * q * lt * cx + lt * lt * p1.x + Math.sin(now * 0.0031) * 6 * Math.sin(Math.PI * u)
        ty = q * q * p0.y + 2 * q * lt * cy + lt * lt * p1.y + Math.sin(now * 0.0047 + 1) * 5 * Math.sin(Math.PI * u)
        tw = flight.w0 + (target.w - flight.w0) * u
        trot = stops[flight.to].rot
        if (now - flight.t0 >= flight.dur) { cur = flight.to; flight = null }
      } else {
        const p = pts[cur]
        tx = p.x; ty = p.y; tw = p.w; trot = stops[cur].rot; perched = stops[cur]
      }

      if (!placed) { x = tx; y = ty; w = tw; rot = trot; placed = true }
      // follow the route closely in the air; settle gently onto the perch
      const ease = 1 - Math.exp(-dt / (flight ? 0.07 : 0.12))
      const nx = x + (tx - x) * ease, ny = y + (ty - y) * ease
      vx = (nx - x) / Math.max(dt, 1e-3); vy = (ny - y) / Math.max(dt, 1e-3)
      x = nx; y = ny; w += (tw - w) * ease
      const dist = Math.hypot(tx - x, ty - y)
      const flying = !!flight || dist > 4
      // head into the direction of travel while flying, settle to the stop's angle when perched
      const heading = Math.hypot(vx, vy) > 40 ? clamp((Math.atan2(vx, -vy) * 180) / Math.PI, -70, 70) : trot
      const targetRot = flying ? heading : trot
      rot += (targetRot - rot) * (1 - Math.exp(-dt / 0.25))

      // hand-off: resting on the hero lantern, the painting shows its own moth again
      const atHero = cur === 0 && !flight && dist < 6
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

      // light: a faint warmth rides with the moth while it flies, gone once it rests
      glow += ((flying ? 1 : 0) - glow) * (1 - Math.exp(-dt / 0.3))
      const h = (w * MOTH_BOX.h) / MOTH_BOX.w
      mothEl.style.width = `${w.toFixed(1)}px`
      mothEl.style.height = `${h.toFixed(1)}px`
      mothEl.style.transform = `translate(${(x - w / 2).toFixed(1)}px,${(y - h * 0.525).toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`
      const gs = Math.max(110, w * 2.4)
      glowEl.style.width = glowEl.style.height = `${gs}px`
      glowEl.style.transform = `translate(${(x - gs / 2).toFixed(1)}px,${(y - gs / 2).toFixed(1)}px)`
      glowEl.style.opacity = (glow * 0.28).toFixed(3)

      // light up whatever it is resting on, or about to land on
      for (const st of stops) {
        const lit = st === perched || (!!flight && st === stops[flight.to] && u > 0.7)
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
        className="absolute top-0 left-0 rounded-full bg-[radial-gradient(closest-side,rgb(255,214,150,0.42),rgb(240,160,85,0.2)_16%,rgb(205,105,45,0.08)_42%,rgb(150,60,25,0.03)_70%,transparent)] mix-blend-screen"
      />
      <div data-moth className="absolute top-0 left-0" style={{ transformOrigin: '50% 52.5%' }} dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  )
}
