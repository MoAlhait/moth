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

/** Endless strip of practice topics, set like a line of calligraphy. Pauses on hover. */
export function Marquee() {
  const row = [...topics, ...topics]
  return (
    <section aria-label="Topics you can practice" className="group relative overflow-hidden border-y border-rice/10 py-9">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-night to-transparent sm:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-night to-transparent sm:w-48" />
      <ul className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= topics.length}
            className="flex items-center gap-10 pr-10 font-display text-[clamp(1.9rem,4.2vw,3.4rem)] leading-none font-medium whitespace-nowrap"
          >
            <span className={`transition-colors duration-500 hover:text-vermilion ${i % 3 === 1 ? 'text-rice' : 'text-rice/30'}`}>
              {t}
            </span>
            <span className="size-2 rotate-45 rounded-[1px] bg-vermilion/80" />
          </li>
        ))}
      </ul>
    </section>
  )
}
