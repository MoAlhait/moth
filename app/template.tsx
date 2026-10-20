'use client'

import { motion } from 'framer-motion'
import { ease } from '@/components/landing/motion-provider'

/**
 * Re-mounts on every route change, so each page fades up out of the ink
 * curtain the launch transition leaves behind. Opacity only: a transform here
 * would trap the fixed-position iframe on /moth.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease }}>
      {children}
    </motion.div>
  )
}
