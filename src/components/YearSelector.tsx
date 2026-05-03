'use client'

import { useState } from 'react'

interface YearSelectorProps {
  value: number
  onChange: (year: number) => void
}

const YEAR_OPTIONS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30]

export function YearSelector({ value, onChange }: YearSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (year: number) => {
    onChange(year)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '12px 16px',
          background: 'var(--card)',
          border: '1px solid var(--bd)',
          borderRadius: '14px',
          cursor: 'pointer',
          gap: '8px',
          fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
        }}
      >
        <span style={{ color: 'var(--t2)', fontSize: '0.8rem', flexShrink: 0 }}>기간</span>
        <span style={{
          flex: 1,
          textAlign: 'left',
          fontWeight: 800,
          fontSize: '1.15rem',
          letterSpacing: '-0.03em',
          color: 'var(--accent)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}년 전
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="var(--t3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 40,
            }}
          />

          {/* Bottom sheet */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(480px, 100vw)',
              background: 'var(--card)',
              borderRadius: '20px 20px 0 0',
              padding: '16px 16px max(28px, env(safe-area-inset-bottom))',
              zIndex: 50,
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: '36px', height: '4px',
              background: 'var(--bd2)',
              borderRadius: '9999px',
              margin: '0 auto 16px',
            }} />

            <p style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--t1)',
              marginBottom: '16px',
              fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
            }}>
              몇 년 전으로 볼까요?
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px',
            }}>
              {YEAR_OPTIONS.map(yr => (
                <button
                  key={yr}
                  onClick={() => handleSelect(yr)}
                  style={{
                    padding: '12px 4px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    background: yr === value ? 'var(--accent)' : 'var(--card-2)',
                    color: yr === value ? '#fff' : 'var(--t2)',
                    fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
                    transition: 'background 0.12s ease',
                  }}
                >
                  {yr}년
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
