export function ContextBar() {
  return (
    <div style={{
      background: '#E5E8EB',
      borderLeft: '3px solid var(--bd2)',
      borderRadius: '6px',
      padding: '8px 12px',
      marginBottom: '8px',
      flexShrink: 0,
    }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
        과거 데이터 기반 참고용이며, 투자 조언이 아닙니다.<br />
        투자 결과에 대한 책임은 투자자 본인에게 있습니다.
      </p>
    </div>
  )
}
