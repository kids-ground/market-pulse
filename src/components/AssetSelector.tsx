'use client'

import type { MetricType } from '@/data/historicalData'

export const ASSET_OPTIONS: { type: MetricType; label: string; buttonLabel: string }[] = [
  { type: 'cash',   label: '현금 보관', buttonLabel: '현금 보관을' },
  { type: 'sp500',  label: 'S&P 500',  buttonLabel: 'S&P 500에 투자' },
  { type: 'nasdaq', label: 'NASDAQ',   buttonLabel: '나스닥에 투자' },
  { type: 'gold',   label: '금',       buttonLabel: '금에 투자' },
]

interface AssetSheetProps {
  open: boolean
  onClose: () => void
  value: MetricType
  onChange: (v: MetricType) => void
}

export function AssetSheet({ open, onClose, value, onChange }: AssetSheetProps) {
  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
      />
      <div style={{
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: 'min(480px, 100vw)',
        background: 'var(--card)',
        borderRadius: '20px 20px 0 0',
        padding: '16px 16px max(28px, env(safe-area-inset-bottom))',
        zIndex: 50,
      }}>
        <div style={{
          width: '36px', height: '4px',
          background: 'var(--bd2)',
          borderRadius: '9999px',
          margin: '0 auto 16px',
        }} />
        <p style={{
          textAlign: 'center', fontWeight: 700, fontSize: '1rem',
          color: 'var(--t1)', marginBottom: '16px',
          fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
        }}>
          투자 대상 선택
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ASSET_OPTIONS.map(opt => (
            <button
              key={opt.type}
              onClick={() => { onChange(opt.type); onClose() }}
              style={{
                padding: '14px 16px', borderRadius: '12px', border: 'none',
                background: opt.type === value ? 'var(--accent)' : 'var(--card-2)',
                color: opt.type === value ? '#fff' : 'var(--t1)',
                fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
