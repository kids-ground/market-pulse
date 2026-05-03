'use client'

import { useRef, useEffect } from 'react'
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

function Sparkline({ data, color }: { data: number[], color: string }) {
  const svgRef  = useRef<SVGSVGElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const areaRef = useRef<SVGPathElement>(null)
  const dotRef  = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const svg  = svgRef.current
    const line = lineRef.current
    const area = areaRef.current
    const dot  = dotRef.current
    if (!svg || !line || !area || !dot) return

    line.style.transition = 'none'
    area.style.transition = 'none'
    dot.style.transition  = 'none'
    area.style.opacity = '0'
    dot.style.opacity  = '0'

    const len = line.getTotalLength()
    line.style.strokeDasharray  = `${len}`
    line.style.strokeDashoffset = `${len}`
    svg.style.visibility = 'visible'

    requestAnimationFrame(() => {
      line.style.transition = 'stroke-dashoffset 0.75s cubic-bezier(0.4, 0, 0.2, 1)'
      line.style.strokeDashoffset = '0'
      area.style.transition = 'opacity 0.4s ease-out 0.55s'
      area.style.opacity = '1'
      dot.style.transition = 'opacity 0.2s ease-out 0.7s'
      dot.style.opacity = '1'
    })
  }, [data])

  const W = 96, H = 64
  const pad = { t: 4, b: 4, l: 2, r: 2 }

  if (data.length < 2) return null

  const minV   = Math.min(...data)
  const maxV   = Math.max(...data)
  const rangeV = maxV - minV || 1

  const pts = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r)
    const y = pad.t + (1 - (v - minV) / rangeV) * (H - pad.t - pad.b)
    return [+x.toFixed(1), +y.toFixed(1)] as [number, number]
  })

  const lineD  = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ')
  const last   = pts[pts.length - 1]
  const first  = pts[0]
  const areaD  = `${lineD} L${last[0]} ${H - pad.b} L${first[0]} ${H - pad.b} Z`
  const gradId = `sg-${color.replace('#', '')}`

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', flexShrink: 0, visibility: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path ref={areaRef} d={areaD} fill={`url(#${gradId})`} style={{ opacity: 0 }} />
      <path ref={lineRef} d={lineD} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle ref={dotRef} cx={last[0]} cy={last[1]} r="2.5" fill={color} style={{ opacity: 0 }} />
    </svg>
  )
}

export function MetricCard({
  type, label, value, pct, pctLabel, sparkData, source,
}: MetricCardProps) {
  const animValue = useAnimatedValue(value)
  const animPct   = useAnimatedValue(pct)

  // 한국 증권 관례: 상승=빨강, 하락=파랑
  const isUp     = type !== 'cash'
  const accentCss = isUp ? 'var(--red)' : 'var(--blue)'
  const accentHex = isUp ? '#E53E4D' : '#3B7FE8'
  const pctSign  = isUp ? '+' : '-'

  return (
    <div className="metric-card">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
        {/* Left: label → pct → value */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
            <p style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--t1)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}>
              {label}
            </p>
            <span style={{ color: 'var(--t2)', fontSize: '0.72rem' }}>*{pctLabel}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <div style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 'clamp(1.2rem, 4.5vw, 1.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
              color: accentCss,
            }}>
              {formatDollar(animValue)}
            </div>
            <span style={{ color: accentCss, fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              ({pctSign}{Math.abs(animPct).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Right: sparkline */}
        <Sparkline data={sparkData} color={accentHex} />
      </div>

      <p style={{ marginTop: '4px', fontSize: '0.65rem', color: 'var(--t3)' }}>
        {source}
      </p>
    </div>
  )
}
