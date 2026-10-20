const topics = [
  'recursion',
  'linked lists',
  'inheritance',
  'trees',
  'higher-order functions',
  'iterators',
  'generators',
  'dictionaries',
  'mutation',
  'list comprehensions',
  'classes',
  'closures',
]

/** Endless strip of practice topics. Pauses on hover. */
export function Marquee() {
  const row = [...topics, ...topics]
  return (
    <section aria-label="Topics you can practice" className="group relative overflow-hidden border-y border-bone/[0.07] py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent sm:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent sm:w-48" />
      <ul className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= topics.length}
            className="flex items-center gap-10 pr-10 font-serif text-[clamp(2rem,4.5vw,3.75rem)] leading-none whitespace-nowrap italic"
          >
            <span className={`transition-colors duration-500 hover:text-lime ${i % 3 === 1 ? 'text-bone' : 'text-bone/35'}`}>
              {t}
            </span>
            <span className="text-[0.4em] text-lime not-italic">✦</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
