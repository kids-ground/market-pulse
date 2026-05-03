'use client'

import { useRef, useEffect } from 'react'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import type { MetricType } from '@/data/historicalData'

interface HeroCardProps {
  type: MetricType
  value: number
  pct: number
  pctLabel: string
  sparkData: number[]
  source: string
  years: number
}

function formatDollar(value: number): string {
  if (value >= 1000) return '$' + Math.round(value).toLocaleString('en-US')
  return '$' + value.toFixed(2)
}

function buildIndices(years: number): number[] {
  const step = years <= 12 ? 1 : Math.ceil(years / 11)
  const indices: number[] = []
  for (let j = years; j >= 1; j -= step) indices.push(j)
  if (indices[indices.length - 1] !== 1) indices.push(1)
  indices.push(0)
  return indices
}

function HeroSparkline({ data, color }: { data: number[], color: string }) {
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
      line.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
      line.style.strokeDashoffset = '0'
      area.style.transition = 'opacity 0.4s ease-out 0.65s'
      area.style.opacity = '1'
      dot.style.transition = 'opacity 0.2s ease-out 0.85s'
      dot.style.opacity = '1'
    })
  }, [data])

  const W = 400, H = 150
  const pad = { t: 8, b: 8, l: 4, r: 8 }

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
  const gradId = `hsg-${color.replace('#', '')}`

  return (
    <svg
      ref={svgRef}
      width="100%" height={H} overflow="visible"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ display: 'block', visibility: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path ref={areaRef} d={areaD} fill={`url(#${gradId})`} style={{ opacity: 0 }} />
      <path ref={lineRef} d={lineD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle ref={dotRef} cx={last[0]} cy={last[1]} r="4" fill={color} style={{ opacity: 0 }} />
    </svg>
  )
}

export function HeroCard({ type, value, pct, pctLabel, sparkData, source, years }: HeroCardProps) {
  const animValue = useAnimatedValue(value)
  const animPct   = useAnimatedValue(pct)

  const isUp      = type !== 'cash'
  const accentCss = isUp ? 'var(--red)' : 'var(--blue)'
  const accentHex = isUp ? '#E53E4D' : '#3B7FE8'
  const pctSign   = isUp ? '+' : '-'

  const indices   = buildIndices(years)
  const yearLabels = indices.map(j => `'${String(2026 - j).slice(-2)}`)

  // 포인트가 많을 경우 최대 6개만 표시
  const labelStep  = Math.ceil(yearLabels.length / 6)
  const visibleLabels = yearLabels.map((yr, i) => ({
    yr,
    pct: i / (yearLabels.length - 1),
    visible: i % labelStep === 0 || i === yearLabels.length - 1,
  }))

  return (
    <div style={{ padding: '4px 0 0' }}>
      <p style={{ marginBottom: '6px', fontSize: '0.65rem', color: 'var(--t3)' }}>
        {source}
      </p>

      <div style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 'clamp(2rem, 9vw, 2.6rem)',
        fontWeight: 800,
        letterSpacing: '-0.04em',
        fontVariantNumeric: 'tabular-nums',
        color: accentCss,
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        {formatDollar(animValue)}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
        <span style={{ color: accentCss, fontSize: '1.2rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {pctSign}{Math.abs(animPct).toFixed(1)}%
        </span>
        <span style={{ color: 'var(--t3)', fontSize: '0.7rem' }}>*{pctLabel}</span>
      </div>

      <HeroSparkline data={sparkData} color={accentHex} />

      {/* 연도 라벨 */}
      <div style={{ position: 'relative', height: '16px', marginTop: '4px' }}>
        {visibleLabels.map(({ yr, pct, visible }) => visible && (
          <span
            key={yr}
            style={{
              position: 'absolute',
              left: `${pct * 100}%`,
              transform: pct === 0 ? 'none' : pct === 1 ? 'translateX(-100%)' : 'translateX(-50%)',
              fontSize: '0.6rem',
              color: 'var(--t3)',
              whiteSpace: 'nowrap',
            }}
          >
            {yr}
          </span>
        ))}
      </div>
    </div>
  )
}
