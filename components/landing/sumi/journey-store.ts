// Shared state between the hero painting and the moth that flies down the page.
type Listener = () => void

type Journey = {
  /** the hero moth has landed, so the page moth may take over */
  heroLanded: boolean
  /** the page moth has left the hero lantern; the painting hides its own moth */
  handedOff: boolean
  /** where the page moth is right now (viewport px) and whether it is in the air */
  x: number
  y: number
  flying: boolean
  listeners: Set<Listener>
  set(patch: Partial<Pick<Journey, 'heroLanded' | 'handedOff'>>): void
}

export const journey: Journey = {
  heroLanded: false,
  handedOff: false,
  x: -9999,
  y: -9999,
  flying: false,
  listeners: new Set(),
  set(patch) {
    Object.assign(journey, patch)
    journey.listeners.forEach((l) => l())
  },
}
