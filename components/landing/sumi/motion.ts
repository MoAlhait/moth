// Moth flight and lantern sway, simulated a frame at a time so wingbeat speed,
// flight path and the pendulum all change smoothly instead of hopping between keyframes.

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))
const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t) }
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
type P = [number, number]
const bez = (p0: P, p1: P, p2: P, p3: P, t: number): P => {
  const u = 1 - t
  return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]) as P
}

// timeline in ms: fly in, a split-second hover, a slow alighting, then it rests
const FLY = 2400, HOVER = 1050, ALIGHT = 1500
const T_ALIGHT = FLY + HOVER
export const T_TOUCH = FLY + HOVER + ALIGHT
// flight path as offsets from the landing spot, in painting units
// the moth comes in from the right (DIR = 1); flip to -1 to bring it in from the left
const DIR = 1
const S: P = [DIR * 62, -16], C1: P = [DIR * 44, -36], C2: P = [DIR * 20, -2], H: P = [DIR * 6.5, -9.5]

export type Sim = { t: number; phase: number; theta: number; omega: number; dip: number; dipV: number; touched: boolean; from: P; fromRot: number }
export const createSim = (): Sim => ({ t: 0, phase: 0, theta: 0, omega: 0, dip: 0, dipV: 0, touched: false, from: H, fromRot: 0 })

export type Pose = ReturnType<typeof step>

export function step(sim: Sim, dt: number) {
  const t = (sim.t += dt), sec = dt / 1000
  let x = 0, y = 0, rot = 0, op = 1, freq = 0, amp = 0
  if (t < FLY) {
    const u = easeInOutSine(t / FLY), p = bez(S, C1, C2, H, u), q = bez(S, C1, C2, H, Math.min(1, u + 0.01))
    // bank into the direction of travel, plus a little restless wobble
    rot = -DIR * Math.max(-20, Math.min(20, Math.atan2(q[1] - p[1], -DIR * (q[0] - p[0])) * 57.3 * 0.32)) + Math.sin(t * 0.004) * 4
    x = p[0]; y = p[1] + Math.sin(t * 0.007) * 1.4 * (1 - u)
    op = smooth(0, 500, t); freq = 7.5; amp = 0.7
  } else if (t < T_ALIGHT) {
    // the hover: a loose figure-eight in front of the light
    const k = t - FLY
    x = H[0] + Math.sin(k * 0.006) * 1.7; y = H[1] + Math.sin(k * 0.012) * 1.05
    rot = DIR * 4 + Math.sin(k * 0.005) * 6; freq = 10.5; amp = 0.8
    sim.from = [x, y]; sim.fromRot = rot
  } else if (t < T_TOUCH) {
    // slow into the landing, wingbeats easing off, a gentle arc onto the paper
    const a = easeOutCubic((t - T_ALIGHT) / ALIGHT)
    x = lerp(sim.from[0], 0, a); y = lerp(sim.from[1], 0, a) - Math.sin(a * Math.PI) * 1.4
    rot = lerp(sim.fromRot, 0, a); freq = lerp(9, 2.4, a); amp = lerp(0.72, 0.2, a)
  }
  sim.phase += Math.PI * 2 * freq * sec
  let open = 1 - amp * (0.5 - 0.5 * Math.cos(sim.phase)), sweep = 0
  if (t >= T_TOUCH) {
    const k = t - T_TOUCH
    // two slow settling flaps, then an occasional slow breath
    open = k < 1500 ? 1 - 0.26 * (1 - k / 3000) * Math.max(0, Math.sin((k / 1500) * Math.PI * 3)) : 1
    sweep = smooth(250, 1700, k)
    // every few seconds it eases its wings open a little and folds them again
    const br = (k - 4200) % 6200
    if (k > 4200 && br < 2400) sweep -= 0.35 * Math.sin((br / 2400) * Math.PI)
    // the lantern takes the moth's weight: an impulse into the pendulum and a small dip
    if (!sim.touched) { sim.touched = true; sim.omega += 4.2; sim.dipV += 2 }
  }
  // the body lifts a touch on each downstroke while flying
  if (t < T_TOUCH) y -= (1 - open) * 0.7
  // damped pendulum about the cord, plus a soft spring for the dip
  // a weak, gusty wind keeps the lantern drifting the whole time; the moth's landing adds to it
  const wind = 3.2 * (0.55 * Math.sin(t * 0.00085) + 0.3 * Math.sin(t * 0.0021 + 1.3) + 0.15 * Math.sin(t * 0.0047 + 2.1))
  sim.omega += (wind - 3.6 * sim.theta - 0.3 * sim.omega) * sec; sim.theta += sim.omega * sec
  sim.dipV += (-38 * sim.dip - 6.5 * sim.dipV) * sec; sim.dip += sim.dipV * sec
  const k = t - T_TOUCH
  return {
    x, y, rot, op, open,
    wingRot: (1 - open) * 11, wingOp: 0.78 + 0.22 * open,
    legs: smooth(T_TOUCH - 900, T_TOUCH - 150, t), sweep,
    squash: k > 0 && k < 520 ? Math.sin((k / 520) * Math.PI) : 0,
    theta: sim.theta, dip: sim.dip,
    glow: t < T_TOUCH ? 0.8 : 0.8 + 0.2 * smooth(0, 900, k) - 0.1 * smooth(2000, 5000, k),
  }
}

/* ---------- applying a pose to the painting ---------- */
export function bind(svg: SVGSVGElement) {
  const q = <T extends Element>(sel: string) => svg.querySelector(sel) as unknown as T
  return {
    fly: q<SVGGElement>('[data-fly]'), sway: q<SVGGElement>('[data-sway]'), glow: q<SVGElement>('[data-glow]'),
    legs: q<SVGGElement>('[data-legs]'), squash: q<SVGGElement>('[data-squash]'),
    wings: [...svg.querySelectorAll<SVGGElement>('[data-wing]')],
  }
}
const r = (n: number) => +n.toFixed(3)
export function apply(els: ReturnType<typeof bind>, p: Pose) {
  els.fly.style.transform = `translate(${r(p.x)}px,${r(p.y)}px) rotate(${r(p.rot)}deg)`
  els.fly.style.opacity = String(r(p.op))
  for (const w of els.wings) {
    const s = Number(w.dataset.wing)
    w.style.transform = `rotate(${r(-s * p.wingRot + s * 54 * p.sweep)}deg) scaleX(${r(p.open * (1 - 0.14 * p.sweep))})`
    w.style.opacity = String(r(p.wingOp))
  }
  els.legs.style.opacity = String(r(p.legs))
  els.squash.style.transform = `scale(${r(1 + 0.03 * p.squash)},${r(1 - 0.05 * p.squash)})`
  els.sway.style.transform = `translateY(${r(p.dip * 0.22)}px) rotate(${r(p.theta)}deg)`
  els.glow.style.opacity = String(r(p.glow))
}
