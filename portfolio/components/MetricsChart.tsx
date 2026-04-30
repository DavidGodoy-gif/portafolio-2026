'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { motion, useInView } from 'framer-motion'

export default function MetricsChart({ data }: any) {
  const chartRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chartRef, { amount: 0.1 })
  const animationDurationMs = 1000

  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const [animatedData, setAnimatedData] = useState(
    safeData.map((item: any) => ({ ...item, value: 0 }))
  )

  useEffect(() => {
    if (!safeData.length) {
      setAnimatedData([])
      return
    }

    if (!isInView) {
      setAnimatedData(safeData.map((item: any) => ({ ...item, value: 0 })))
      return
    }

    let frameId = 0
    const start = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / animationDurationMs, 1)
      const eased = easeOutCubic(progress)

      setAnimatedData(
        safeData.map((item: any) => ({
          ...item,
          value: (Number(item.value) || 0) * eased
        }))
      )

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [isInView, safeData])

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-20 h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={animatedData}>
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
