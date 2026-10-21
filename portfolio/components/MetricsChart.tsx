'use client'

import {useId} from 'react'
import {BarChart, Bar, XAxis, Tooltip, ResponsiveContainer} from 'recharts'
import MediaReveal from './MediaReveal'

type Metric = {label: string; value: number}

export default function MetricsChart({data}: {data: Metric[]}) {
  const gradientId = `metric-gradient-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const metrics = Array.isArray(data) ? data : []
  if (!metrics.length) return null

  return (
    <MediaReveal kind="chart" className="w-full min-w-0">
      {/* Percentage height collapses inside the article's auto-height flex layout. */}
      <ResponsiveContainer width="100%" height={300} minWidth={0}>
        <BarChart data={metrics} margin={{top:20,right:12,bottom:16,left:12}}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="100%" stopColor="var(--magenta)" />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" axisLine={{stroke:'#94a3b8'}} tickLine={false} tick={{fill:'#c1d5e5',fontSize:13}} />
          <Tooltip contentStyle={{background:'#081e2b',border:'1px solid #334155',borderRadius:8,color:'#f2f5fa'}} itemStyle={{color:'#f2f5fa'}} />
          <Bar dataKey="value" fill={`url(#${gradientId})`} radius={[10,10,0,0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
      <ul className="sr-only">{metrics.map((metric,i)=><li key={i}>{metric.label}: {metric.value}</li>)}</ul>
    </MediaReveal>
  )
}
