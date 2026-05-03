'use client'

import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import type { MetricType } from '@/data/historicalData'

interface MetricCardProps {
  type: MetricType
  label: string
  value: number
  pct: number
  pctLabel: string
  sparkData: number[]
  source: string
}

function formatDollar(value: number): string {
  if (value >= 1000) return '$' + Math.round(value).toLocaleString('en-US')
  return '$' + value.toFixed(2)
}

export function MetricCard({ type, label, value, pct, source, onClick }: MetricCardProps & { onClick?: () => void }) {
  const animValue = useAnimatedValue(value)
  const animPct   = useAnimatedValue(pct)

  const isUp      = type !== 'cash'
  const accentCss = isUp ? 'var(--red)' : 'var(--blue)'
  const pctSign   = isUp ? '+' : '-'

  return (
    <div className="metric-card" onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--t1)', margin: 0 }}>
          {label}
        </p>
        <p style={{ fontSize: '0.65rem', color: 'var(--t3)', margin: 0, marginTop: '2px' }}>
          {source}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '1.15rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          color: accentCss,
        }}>
          {formatDollar(animValue)}
        </span>
        <span style={{ color: accentCss, fontSize: '0.9rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          ({pctSign}{Math.abs(animPct).toFixed(1)}%)
        </span>
      </div>
    </div>
  )
}
