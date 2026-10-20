import { useId } from 'react'

/** The moth glyph from public/icon.svg, without its background tile. */
export function MothMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="8 12 48 34" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8d66d" />
          <stop offset="100%" stopColor="#9dbbc0" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        <path d="M11 25c8 0 13 4 17 9-4 5-9 9-17 9 4-6 4-12 0-18z" />
        <path d="M53 25c-8 0-13 4-17 9 4 5 9 9 17 9-4-6-4-12 0-18z" />
        <path d="M32 22c3 0 5 2 5 5v17h-10V27c0-3 2-5 5-5z" />
        <circle cx="32" cy="18" r="4" />
      </g>
    </svg>
  )
}
