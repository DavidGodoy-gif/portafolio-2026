'use client'

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { motion } from 'framer-motion'

export default function MetricsChart({ data }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-20 h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient
              id="magentaCyanGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
              gradientTransform="rotate(45)"
            >
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="100%" stopColor="var(--purple)" />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" />
          <Tooltip />
          <Bar dataKey="value" fill="url(#magentaCyanGradient)" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
