'use client'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-24 py-32"
    >
      <motion.h1
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        className="text-6xl font-bold"
      >
        David Godoy
      </motion.h1>

      <p className="mt-6 text-neutral-400">
        UX Engineer — Research → Design → Frontend
      </p>
    </motion.main>
  )
}
