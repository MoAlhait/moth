'use client'

import { useId, useMemo } from 'react'
import { sumiPaintingSvg } from './art'

/**
 * A smaller lantern from the same painting, hung in the page as a stop on the moth's
 * flight. It drifts in a weak breeze and brightens while the moth rests on it
 * (the journey sets data-lit on it).
 */
export function SmallLantern({ className, anchor, order }: { className?: string; anchor: string; order: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const markup = useMemo(() => sumiPaintingSvg(`l${uid}`, { withMoth: false, transparent: true }), [uid])
  return (
    <div
      aria-hidden
      className={`sumi-small-lantern ${className ?? ''}`}
      data-moth-anchor={anchor}
      data-moth-order={order}
      data-moth-ax="0.70"
      data-moth-ay="0.41"
      data-moth-size="0.416"
      data-moth-rot="-14"
    >
      <div className="relative size-full">
        {/* the light it throws, outside the painting's box so it can fade out softly */}
        <span className="lantern-light" />
        <div className="relative size-full" dangerouslySetInnerHTML={{ __html: markup }} />
      </div>
    </div>
  )
}
