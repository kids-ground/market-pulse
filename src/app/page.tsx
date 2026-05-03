'use client'

import { useState, useMemo } from 'react'
import { calcValues, calcSparklineData } from '@/data/historicalData'
import type { MetricType } from '@/data/historicalData'
import { MetricCard } from '@/components/MetricCard'
import { HeroCard } from '@/components/HeroCard'
import { ContextBar } from '@/components/ContextBar'
import { YearSheet } from '@/components/YearSelector'
import { AssetSheet, ASSET_OPTIONS } from '@/components/AssetSelector'

const CARD_META: Record<MetricType, { label: string; pctLabel: string; source: string }> = {
  cash:   { label: '현금 보관', pctLabel: '구매력 손실', source: 'BLS CPI-U 기반' },
  sp500:  { label: 'S&P 500',  pctLabel: '누적 수익',   source: 'S&P DJ Indices 기반' },
  nasdaq: { label: 'NASDAQ',   pctLabel: '누적 수익',   source: 'Yahoo Finance 기반' },
  gold:   { label: '금',       pctLabel: '누적 수익',   source: 'LBMA 현물가 기반' },
}

const ALL_TYPES: MetricType[] = ['cash', 'sp500', 'nasdaq', 'gold']

export default function Home() {
  const [years, setYears] = useState(5)
  const [selectedType, setSelectedType] = useState<MetricType>('cash')
  const [yearSheetOpen, setYearSheetOpen] = useState(false)
  const [assetSheetOpen, setAssetSheetOpen] = useState(false)

  const c = useMemo(() => calcValues(years), [years])
  const spark = useMemo(() => ({
    cash:  calcSparklineData(years, 'cash'),
    sp500: calcSparklineData(years, 'sp500'),
    nasdaq: calcSparklineData(years, 'nasdaq'),
    gold:  calcSparklineData(years, 'gold'),
  }), [years])

  const valueMap: Record<MetricType, number> = {
    cash: c.cashValue, sp500: c.spValue, nasdaq: c.nqValue, gold: c.goldValue,
  }
  const pctMap: Record<MetricType, number> = {
    cash: c.infPct, sp500: c.spPct, nasdaq: c.nqPct, gold: c.goldPct,
  }

  const assetButtonLabel = ASSET_OPTIONS.find(o => o.type === selectedType)?.buttonLabel ?? ''
  const comparisonTypes  = ALL_TYPES.filter(t => t !== selectedType)

  const inlineBtnStyle: React.CSSProperties = {
    display: 'inline',
    background: 'none',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    color: 'var(--accent)',
    borderBottom: '2.5px dashed var(--accent)',
    fontWeight: 800,
    fontSize: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
    fontFamily: 'inherit',
  }

  return (
    <main
      className="flex flex-col mx-auto w-full px-4 py-5 sm:px-6 md:px-8"
      style={{ maxWidth: '540px', minWidth: '320px', height: '100dvh', overflow: 'hidden' }}
    >
      <ContextBar />

      {/* Title */}
      <header className="mb-12 shrink-0">
        <h1 style={{
          fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.1rem, 3.4vw, 1.5rem)',
          letterSpacing: '-0.025em',
          color: 'var(--t1)',
          lineHeight: 1.5,
        }}>
          <button style={inlineBtnStyle} onClick={() => setYearSheetOpen(true)}>{years}년 전</button>
          {', $100 를'}<br />
          <button style={inlineBtnStyle} onClick={() => setAssetSheetOpen(true)}>{assetButtonLabel}</button>
          {' 했더라면?'}
        </h1>
      </header>

      {/* Scrollable area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'none' }}>

        {/* Hero Card */}
        <HeroCard
          type={selectedType}
          value={valueMap[selectedType]}
          pct={pctMap[selectedType]}
          pctLabel={CARD_META[selectedType].pctLabel}
          sparkData={spark[selectedType]}
          source={CARD_META[selectedType].source}
          years={years}
        />

        {/* Comparison Section */}
        <p style={{
          fontSize: '1.3rem', fontWeight: 700,
          color: 'var(--t1)', marginBottom: '16px', marginTop: '48px',
          fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
        }}>
          같은 기간 여기에 투자했다면?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px' }}>
          {comparisonTypes.map(type => (
            <MetricCard
              key={type}
              type={type}
              label={CARD_META[type].label}
              value={valueMap[type]}
              pct={pctMap[type]}
              pctLabel={CARD_META[type].pctLabel}
              sparkData={spark[type]}
              source={CARD_META[type].source}
              onClick={() => setSelectedType(type)}
            />
          ))}
        </div>

      </div>

      <YearSheet  open={yearSheetOpen}  onClose={() => setYearSheetOpen(false)}  value={years}        onChange={setYears} />
      <AssetSheet open={assetSheetOpen} onClose={() => setAssetSheetOpen(false)} value={selectedType} onChange={setSelectedType} />
    </main>
  )
}
