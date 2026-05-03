'use client'

import { useState, useMemo } from 'react'
import { calcValues, calcSparklineData } from '@/data/historicalData'
import { YearSelector } from '@/components/YearSelector'
import { MetricCard } from '@/components/MetricCard'
import { ContextBar } from '@/components/ContextBar'


export default function Home() {
  const [years, setYears] = useState(10)
  const c     = useMemo(() => calcValues(years), [years])
  const spark = useMemo(() => ({
    sp:  calcSparklineData(years, 'sp500'),
    nq:  calcSparklineData(years, 'nasdaq'),
    inf: calcSparklineData(years, 'cash'),
  }), [years])

  return (
    <main
      className="flex flex-col mx-auto w-full px-4 py-5 sm:px-6 md:px-8 md:py-5"
      style={{ maxWidth: '480px', height: '100dvh', overflow: 'hidden' }}
    >
      {/* Header */}
      <header className="mb-4 shrink-0">
        <h1
          style={{
            fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.25rem, 3.8vw, 1.85rem)',
            letterSpacing: '-0.025em',
            color: 'var(--t1)',
            marginBottom: '4px',
            lineHeight: 1.2,
          }}
        >
          {years}년 전{' '}
          <span style={{ color: 'var(--accent)' }}>$100</span>이면 지금은?
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--t2)' }}>
          {c.startYear}년 5월 → 2026년 5월 · 미국 자본시장 비교
        </p>
      </header>

      {/* Year Selector */}
      <div className="mb-4 shrink-0">
        <YearSelector value={years} onChange={setYears} />
      </div>

      {/* Cards — 세로 리스트 */}
      <div className="cards-list">
        <MetricCard
          type="cash"
          label="현금 보관"
          value={c.cashValue}
          pct={c.infPct}
          pctLabel="구매력 손실"
          sparkData={spark.inf}
          source="미국 노동통계국 CPI-U 기준 (2026.03 최신)"
        />
        <MetricCard
          type="sp500"
          label="S&P 500"
          value={c.spValue}
          pct={c.spPct}
          pctLabel="누적 수익"
          sparkData={spark.sp}
          source="S&P DJ Indices 실제값 (1~5년) · 이후 근사"
        />
        <MetricCard
          type="nasdaq"
          label="NASDAQ"
          value={c.nqValue}
          pct={c.nqPct}
          pctLabel="누적 수익"
          sparkData={spark.nq}
          source="Yahoo Finance 기반 추정치"
        />
      </div>

      {/* Context Bar */}
      <ContextBar />
    </main>
  )
}
