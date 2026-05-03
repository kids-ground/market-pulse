'use client'

const YEAR_OPTIONS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30]

interface YearSheetProps {
  open: boolean
  onClose: () => void
  value: number
  onChange: (v: number) => void
}

export function YearSheet({ open, onClose, value, onChange }: YearSheetProps) {
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
          몇 년 전으로 볼까요?
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {YEAR_OPTIONS.map(y => (
            <button
              key={y}
              onClick={() => { onChange(y); onClose() }}
              style={{
                padding: '12px 4px', borderRadius: '12px', border: 'none',
                background: y === value ? 'var(--accent)' : 'var(--card-2)',
                color: y === value ? '#fff' : 'var(--t2)',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                fontFamily: 'var(--font-inter), var(--font-noto), sans-serif',
              }}
            >
              {y}년
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
