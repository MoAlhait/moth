'use client'

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { LaunchLink } from './launch'
import { MothMark } from './moth-mark'
import { ease } from './motion-provider'

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#principle', label: 'Principle' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 1, ease }}
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-5"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border py-2 pr-2 pl-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? 'border-bone/10 bg-ink-1/55 shadow-[0_18px_50px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl'
            : 'border-transparent'
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5">
          <MothMark className="h-5 w-auto transition-transform duration-500 ease-expo group-hover:-rotate-12 group-hover:scale-110" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">moth</span>
        </a>

        <ul className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                className="relative z-10 block px-4 py-2 text-[13px] text-bone-2 transition-colors duration-300 hover:text-bone"
              >
                {l.label}
              </a>
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 rounded-full bg-bone/[0.07]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        <LaunchLink className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-bone px-4 py-2 font-mono text-[11px] font-medium tracking-[0.12em] text-ink uppercase">
          <span className="absolute inset-0 translate-y-full rounded-full bg-lime transition-transform duration-500 ease-expo group-hover:translate-y-0" />
          <span className="relative">Open moth</span>
          <span className="relative transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </LaunchLink>
      </nav>
    </motion.header>
  )
}
