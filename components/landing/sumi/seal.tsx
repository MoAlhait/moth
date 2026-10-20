'use client'

import { useId } from 'react'
import { sealSvg } from './art'

/** The vermilion hanko with the moth carved out. The small form of the logo. */
export function Seal({ className, title }: { className?: string; title?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const markup = sealSvg(`s${uid}`, 'style="display:block;width:100%;height:100%"')
  return (
    <span
      className={`inline-block ${className ?? ''}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
