// The moth logo, painted in sumi-e ink and watercolor with SVG filters, plus the
// small vermilion seal used where the painting would be too small to read.
// Everything is generated as markup so the painting and its motion stay in one place.

const f = (n: number) => +n.toFixed(2)
const mirror = (d: string) => d.replace(/(-?\d*\.?\d+)\s*(-?\d*\.?\d+)/g, (_m, x, y) => ` ${f(-parseFloat(x))} ${y} `)

// prefix every id and reference so several paintings or seals can share a page
const scope = (markup: string, p: string) =>
  markup
    .replace(/\bid="([A-Za-z][\w-]*)"/g, `id="${p}$1"`)
    .replace(/url\(#([\w-]+)\)/g, `url(#${p}$1)`)
    .replace(/href="#([\w-]+)"/g, `href="#${p}$1"`)

/* ---------- moth: a few loose brush strokes, painted by hand rather than drawn ---------- */
type V = [number, number]
// the left forewing as the brush laid it down: one wet stroke from the body out to the tip
const foreL = 'M-1.6 -4.6C-6 -7.6-13.2-10-21.6-10.6-22.4-8.6-21.6-5.8-19.8-3.8-17.6-1.4-15-.2-12.6.8-8.4 1.8-4.6 1.2-1.6.4Z'
const hindL = 'M-1.6 .2C-5.8.4-10.8 1.8-12.6 4.8-13.4 7-12.2 9.4-9.6 9.6-6.6 9.8-3.8 7.4-2.4 4.4Z'

// a hand never paints both wings the same: nudge the right side's points a little
const wobble = (d: string, seed: number, amt: number) => {
  let i = 0
  return d.replace(/(-?\d*\.?\d+)\s*(-?\d*\.?\d+)/g, (_m, x, y) => {
    const k = Math.sin(seed + i++ * 12.9898) * 43758.5453, n = k - Math.floor(k)
    const k2 = Math.sin(seed + i * 78.233) * 12345.678, n2 = k2 - Math.floor(k2)
    return ` ${f(+x + (n - 0.5) * amt)} ${f(+y + (n2 - 0.5) * amt)} `
  })
}

// dry streaks where the brush hairs ran out of ink, following the stroke direction
const streaksL = 'M-3 -3.4C-8 -5.6-14 -7.6-20.4 -9.2M-4 -.4C-8.4 -1.4-12.8 -2.6-16.6 -3.4'

const wing = (s: 1 | -1) => {
  const fore = s > 0 ? wobble(mirror(foreL), 3, 0.9) : foreL
  const hind = s > 0 ? wobble(mirror(hindL), 7, 0.8) : hindL
  const streaks = s > 0 ? wobble(mirror(streaksL), 11, 0.7) : streaksL
  return `<g data-wing="${s}" style="transform-box:fill-box;transform-origin:${s > 0 ? '0%' : '100%'} 30%">
    <g filter="url(#mothWash)"><path d="${hind}" fill="url(#hind${s > 0 ? 'R' : 'L'})"/></g>
    <g filter="url(#mothWash)"><path d="${fore}" fill="url(#wing${s > 0 ? 'R' : 'L'})"/></g>
    <path d="${streaks}" fill="none" stroke="#e9d6b0" stroke-opacity=".07" stroke-width="1.1" stroke-linecap="round" filter="url(#dry)"/>
    <ellipse cx="${s * (12.6 + (s > 0 ? 0.6 : 0))}" cy="${s > 0 ? -5.4 : -6}" rx="${s > 0 ? 1.1 : 1.3}" ry=".8" fill="#0f0b08" fill-opacity=".55" filter="url(#ink)"/>
  </g>`
}

const moth = `
  <g data-legs style="opacity:0"></g>
  ${wing(-1)}${wing(1)}
  <g filter="url(#dry)" fill="none" stroke="#1a130d" stroke-linecap="round">
    <path d="M-.5 -8C-1.6 -11.4-3.8 -14.8-7.6 -17" stroke-width=".55"/>
    <path d="M.6 -8.2C1.4 -12 3.6 -15 6.6 -17.8" stroke-width=".5"/>
  </g>
  <!-- the body: one tapered stroke, heavy where the brush pressed, lifting toward the tail -->
  <g filter="url(#ink)">
    <path d="M.1 -8.6C1.9 -8.4 2.9 -5.4 2.7 -1.6 2.5 3 1.5 7.6.3 11.4-.1 12-.5 11.8-.7 11.2-1.9 7.4-2.7 3-2.8-1.4-2.9-5.4-1.9-8.6.1-8.6Z" fill="#1a130d" fill-opacity=".9"/>
  </g>`

/* ---------- lantern geometry ---------- */
const CX = 57, TOP = 29.4, BOT = 75.8, HW = 19
const wAt = (t: number) => Math.max(8.2, HW * Math.pow(1 - Math.pow(Math.abs(t * 2 - 1), 2.5), 1 / 2.5))
const lanternBody = (() => {
  const L: [number, number][] = [], R: [number, number][] = []
  for (let i = 0; i <= 64; i++) { const t = i / 64, y = TOP + (BOT - TOP) * t, w = wAt(t); L.push([CX - w, y]); R.push([CX + w, y]) }
  return 'M' + [...L, ...R.reverse()].map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
})()
// ribs as closed brush strokes: thick in the middle, tapering to points, each a little different
const ribs = (() => {
  let out = '', seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (let i = 1; i < 12; i++) {
    const t = i / 12, y = TOP + (BOT - TOP) * t, w = wAt(t) - 0.5, bow = w * 0.12, jit = (rnd() - 0.5) * 0.5
    const cxr = CX + (rnd() - 0.5) * 2, th = 0.32 + rnd() * 0.26
    out += `<path d="M${f(CX - w)} ${f(y + jit)}Q${f(cxr)} ${f(y + bow * 2 + jit - th)} ${f(CX + w)} ${f(y - jit)}Q${f(cxr)} ${f(y + bow * 2 + jit + th)} ${f(CX - w)} ${f(y + jit)}Z" fill-opacity="${f(0.32 + rnd() * 0.28)}"/>`
  }
  return out
})()

/* ---------- filters and pigments ---------- */
const stampFilter = `<filter id="stamp" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves="2" seed="31" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.45" result="mask"/>
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale=".35" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feComposite in="d" in2="mask" operator="in"/>
  </filter>`

const defs = `<defs>
  <filter id="fibers" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="2" result="g"/>
    <feColorMatrix in="g" values="0 0 0 0 .42  0 0 0 0 .33  0 0 0 0 .2  0 0 0 .5 -.18" result="grain"/>
    <feTurbulence type="turbulence" baseFrequency=".07 .5" numOctaves="2" seed="14" result="t"/>
    <feColorMatrix in="t" values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .26  0 0 0 2.6 -1.9" result="fib"/>
    <feMerge><feMergeNode in="grain"/><feMergeNode in="fib"/></feMerge>
  </filter>
  <filter id="stains" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="4" seed="9" result="s"/>
    <feColorMatrix in="s" values="0 0 0 0 .55  0 0 0 0 .4  0 0 0 0 .22  0 0 0 .9 -.32"/>
  </filter>
  <radialGradient id="vignette" cx="57%" cy="50%" r="70%"><stop offset=".45" stop-color="#0e0c0a" stop-opacity="0"/><stop offset="1" stop-color="#0e0c0a" stop-opacity=".9"/></radialGradient>
  <filter id="wash" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="4" seed="3" result="low"/>
    <feDisplacementMap in="SourceGraphic" in2="low" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="warp"/>
    <feGaussianBlur in="warp" stdDeviation=".28" result="soft"/>
    <feGaussianBlur in="warp" stdDeviation="1.5" result="wide"/>
    <feComposite in="soft" in2="wide" operator="arithmetic" k2="2.1" k3="-1.75" result="rim"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="8" result="gn"/>
    <feColorMatrix in="gn" type="saturate" values="0" result="gg"/>
    <feComposite in="soft" in2="gg" operator="arithmetic" k1=".32" k2=".82" result="grainy"/>
    <feMerge><feMergeNode in="grainy"/><feMergeNode in="rim"/></feMerge>
  </filter>
  <filter id="mothWash" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".16" numOctaves="3" seed="19" result="low"/>
    <feDisplacementMap in="SourceGraphic" in2="low" scale="1.9" xChannelSelector="R" yChannelSelector="G" result="warp"/>
    <feGaussianBlur in="warp" stdDeviation=".22" result="soft"/>
    <feGaussianBlur in="warp" stdDeviation="1.1" result="wide"/>
    <feComposite in="soft" in2="wide" operator="arithmetic" k2="2.3" k3="-1.9" result="rim"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="23" result="gn"/>
    <feColorMatrix in="gn" type="saturate" values="0" result="gg"/>
    <feComposite in="soft" in2="gg" operator="arithmetic" k1=".45" k2=".72" result="grainy"/>
    <feMerge><feMergeNode in="grainy"/><feMergeNode in="rim"/></feMerge>
  </filter>
  <filter id="bleed" x="-50%" y="-50%" width="200%" height="200%">
    <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="5" result="low"/>
    <feDisplacementMap in="SourceGraphic" in2="low" scale="10" xChannelSelector="R" yChannelSelector="G" result="w"/>
    <feGaussianBlur in="w" stdDeviation="5"/>
  </filter>
  <filter id="ink" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" seed="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale=".55" xChannelSelector="R" yChannelSelector="G" result="rag"/>
    <feGaussianBlur in="rag" stdDeviation=".6" result="feather"/>
    <feComponentTransfer in="feather" result="halo"><feFuncA type="linear" slope=".35"/></feComponentTransfer>
    <feGaussianBlur in="rag" stdDeviation=".18" result="core"/>
    <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="12" result="dry"/>
    <feColorMatrix in="dry" type="saturate" values="0" result="dg"/>
    <feComposite in="core" in2="dg" operator="arithmetic" k1=".18" k2=".9" result="dryCore"/>
    <feMerge><feMergeNode in="halo"/><feMergeNode in="dryCore"/></feMerge>
  </filter>
  <filter id="dry" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="2.2 .35" numOctaves="2" seed="21" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.55" result="mask"/>
    <feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="6" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale=".4" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feComposite in="d" in2="mask" operator="in"/>
  </filter>
  <filter id="inkSolid" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="17" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale=".5" xChannelSelector="R" yChannelSelector="G" result="rag"/>
    <feGaussianBlur in="rag" stdDeviation=".5" result="feather"/>
    <feComponentTransfer in="feather" result="halo"><feFuncA type="linear" slope=".3"/></feComponentTransfer>
    <feGaussianBlur in="rag" stdDeviation=".12" result="core"/>
    <feMerge><feMergeNode in="halo"/><feMergeNode in="core"/></feMerge>
  </filter>
  ${stampFilter}
  <linearGradient id="capInk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2a1c"/><stop offset=".18" stop-color="#16110d"/><stop offset=".3" stop-color="#6b5440"/><stop offset=".4" stop-color="#1d1611"/><stop offset=".85" stop-color="#120e0b"/><stop offset="1" stop-color="#3a2a1c"/></linearGradient>
  <radialGradient id="bloomV" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#c94a28" stop-opacity=".32"/><stop offset=".7" stop-color="#c94a28" stop-opacity=".14"/><stop offset="1" stop-color="#c94a28" stop-opacity="0"/></radialGradient>
  <radialGradient id="bloomO" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e8a24e" stop-opacity=".35"/><stop offset="1" stop-color="#e8a24e" stop-opacity="0"/></radialGradient>
  <radialGradient id="lightCore" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fffaea" stop-opacity=".95"/><stop offset=".5" stop-color="#fbe6b8" stop-opacity=".35"/><stop offset="1" stop-color="#fbe6b8" stop-opacity="0"/></radialGradient>
  <radialGradient id="rootInk" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#14110e" stop-opacity=".7"/><stop offset="1" stop-color="#14110e" stop-opacity="0"/></radialGradient>
  <radialGradient id="lanternWash" cx="48%" cy="44%" r="62%"><stop offset="0" stop-color="#fff3d2" stop-opacity=".98"/><stop offset=".28" stop-color="#ffc47a" stop-opacity=".95"/><stop offset=".66" stop-color="#e2632f" stop-opacity=".92"/><stop offset="1" stop-color="#8f2a17" stop-opacity=".95"/></radialGradient>
  <radialGradient id="lanternWash2" cx="38%" cy="60%" r="55%"><stop offset="0" stop-color="#e2582f" stop-opacity="0"/><stop offset=".6" stop-color="#e2582f" stop-opacity=".18"/><stop offset="1" stop-color="#b13a1f" stop-opacity=".35"/></radialGradient>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f6b462" stop-opacity=".62"/><stop offset=".35" stop-color="#d9772f" stop-opacity=".26"/><stop offset=".7" stop-color="#9c4a1c" stop-opacity=".08"/><stop offset="1" stop-color="#9c4a1c" stop-opacity="0"/></radialGradient>
  <radialGradient id="wingL" cx="100%" cy="45%" r="105%"><stop offset="0" stop-color="#1a130d" stop-opacity=".95"/><stop offset=".4" stop-color="#3d2f22" stop-opacity=".82"/><stop offset=".78" stop-color="#6e5843" stop-opacity=".62"/><stop offset="1" stop-color="#b08458" stop-opacity=".5"/></radialGradient>
  <radialGradient id="wingR" cx="0%" cy="45%" r="105%"><stop offset="0" stop-color="#1a130d" stop-opacity=".95"/><stop offset=".42" stop-color="#40311f" stop-opacity=".8"/><stop offset=".8" stop-color="#735c44" stop-opacity=".6"/><stop offset="1" stop-color="#b8895a" stop-opacity=".52"/></radialGradient>
  <radialGradient id="hindL" cx="100%" cy="20%" r="110%"><stop offset="0" stop-color="#241a12" stop-opacity=".85"/><stop offset=".6" stop-color="#5e4a37" stop-opacity=".5"/><stop offset="1" stop-color="#a27a52" stop-opacity=".38"/></radialGradient>
  <radialGradient id="hindR" cx="0%" cy="20%" r="110%"><stop offset="0" stop-color="#241a12" stop-opacity=".85"/><stop offset=".6" stop-color="#5e4a37" stop-opacity=".48"/><stop offset="1" stop-color="#a27a52" stop-opacity=".36"/></radialGradient>
</defs>`

/* ---------- seal: a vermilion hanko with the moth carved out (white on red) ---------- */
const sealMoth = `<path d="${foreL}"/><path d="${mirror(foreL)}"/><path d="${hindL}"/><path d="${mirror(hindL)}"/>
  <path d="M0 -8.6c1 0 1.8.9 1.8 2 0 .6-.3 1.1-.6 1.5 1.3.7 2.2 2.2 2.2 4 0 1.2-.4 2.2-1.1 3 .5 2.2.3 5-.5 7.4-.5 1.2-1 1.8-1.8 1.8s-1.3-.6-1.8-1.8c-.8-2.4-1-5.2-.5-7.4-.7-.8-1.1-1.8-1.1-3 0-1.8.9-3.3 2.2-4-.3-.4-.6-.9-.6-1.5 0-1.1.8-2 1.8-2z" fill="#b8372a"/>
  <path d="M.6 -7.6Q2.6 -13.6 7.4 -17.2M-.6 -7.6Q-2.6 -13.6-7.4 -17.2" fill="none" stroke="#efe3c6" stroke-width="1.4" stroke-linecap="round"/>`
const seal = (x: number, y: number) => `<g transform="translate(${x} ${y})">
  <g filter="url(#stamp)"><rect x="0" y="0" width="9.2" height="9.2" rx=".7" fill="#b8372a" fill-opacity=".92"/></g>
  <g transform="translate(4.6 4.9) scale(.15)" fill="#efe3c6">${sealMoth}</g>
</g>`

/* ---------- full painting ---------- */
export function sumiPaintingSvg(prefix: string, { withSeal = false, withMoth = true, transparent = false } = {}) {
  return scope(
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%">
  ${defs}
  ${transparent ? '' : '<rect width="100" height="100" fill="#0e0c0a"/><rect width="100" height="100" filter="url(#stains)" opacity=".18"/>'}
  <ellipse data-glow cx="57" cy="52" rx="50" ry="50" fill="url(#glow)" filter="url(#bleed)" style="opacity:.8"/>
  <g data-sway style="transform-box:view-box;transform-origin:57px -3px">
    <path d="M57 -3C56.6 6 57.4 14 57 25.4" fill="none" stroke="#7a6248" stroke-width=".75" stroke-linecap="round" filter="url(#dry)"/>
    <path id="lanternBody" filter="url(#wash)" fill="url(#lanternWash)" d="${lanternBody}"/>
    <use href="#lanternBody" fill="url(#lanternWash2)" filter="url(#wash)" transform="translate(.6 .4)"/>
    <clipPath id="bodyClip"><use href="#lanternBody"/></clipPath>
    <g clip-path="url(#bodyClip)">
      <g filter="url(#bleed)">
        <ellipse cx="47" cy="62" rx="9" ry="7" fill="url(#bloomV)"/>
        <ellipse cx="67" cy="40" rx="7" ry="9" fill="url(#bloomV)"/>
        <ellipse cx="63" cy="66" rx="8" ry="5" fill="url(#bloomO)"/>
      </g>
      <ellipse cx="55.5" cy="48" rx="11" ry="13" fill="url(#lightCore)" filter="url(#bleed)"/>
    </g>
    <g filter="url(#dry)" fill="#5a2a18">${ribs}</g>
    <g filter="url(#inkSolid)" fill="url(#capInk)">
      <path d="M48.6 25.4c-.2-1.6.6-2.8 2.2-3h12.4c1.6.2 2.4 1.4 2.2 3l-.2 2.6c-.2.9-.9 1.4-1.8 1.4H50.6c-.9 0-1.6-.5-1.8-1.4z"/>
      <path d="M48.8 77.4c-.2-1 .5-1.8 1.6-1.8h13.2c1.1 0 1.8.8 1.6 1.8l-.4 2.8c-.2 1-1 1.6-2 1.6H51.2c-1 0-1.8-.6-2-1.6z"/>
    </g>
    <path d="M57 81.8c.2 3 .1 5.4-.3 9.8M57 81.8c-.4 3-1.1 6-1.9 9.2M57 81.8c.5 3 1.3 5.8 2.1 8.8" fill="none" stroke="#b5432c" stroke-width=".7" stroke-linecap="round" filter="url(#dry)" opacity=".85"/>
    ${withMoth ? `<g data-fly style="transform-box:view-box;transform-origin:70px 41px;opacity:0">
      <g transform="translate(70 41) rotate(-14) scale(.8)">
        <g data-squash style="transform-box:fill-box;transform-origin:50% 60%">${moth}</g>
      </g>
    </g>` : ''}
  </g>
  ${withSeal ? seal(13, 78) : ''}
  ${transparent ? '' : '<rect width="100" height="100" fill="url(#vignette)"/>'}
</svg>`,
    prefix,
  )
}

/* ---------- seal on its own, for nav, footer and favicon ---------- */
export function sealSvg(prefix: string, attrs = '') {
  return scope(
    `<svg viewBox="-.6 -.6 10.4 10.4" xmlns="http://www.w3.org/2000/svg" ${attrs}><defs>${stampFilter}</defs>${seal(0, 0)}</svg>`,
    prefix,
  )
}

/* ---------- the moth on its own, for the flight down the page ----------
   viewBox is centred on the body: (0,0) sits 50% across and 52.5% down */
export const MOTH_BOX = { x: -26, y: -21, w: 52, h: 40 }
export function mothSvg(prefix: string) {
  return scope(
    `<svg viewBox="${MOTH_BOX.x} ${MOTH_BOX.y} ${MOTH_BOX.w} ${MOTH_BOX.h}" xmlns="http://www.w3.org/2000/svg" overflow="visible" style="display:block;width:100%;height:100%;overflow:visible">
  ${defs}
  <g data-squash style="transform-box:fill-box;transform-origin:50% 60%">${moth}</g>
</svg>`,
    prefix,
  )
}
