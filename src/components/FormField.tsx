import type { ReactNode } from 'react'

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--color-muted)',
        marginBottom: 4,
      }}>{label}</label>
      {children}
    </div>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%', padding: '7px 10px', fontSize: 13,
  border: '1px solid var(--color-border-variant)', borderRadius: 'var(--radius)',
  fontFamily: 'var(--font-body)', color: 'var(--color-on-surface)',
  background: 'var(--color-surface)', outline: 'none',
}

export function Select({
  value, onChange, children,
}: {
  value: string
  onChange: (v: string) => void
  children: ReactNode
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={inputBase}>
      {children}
    </select>
  )
}

export function TextArea({ value, onChange, rows = 3 }: {
  value: string; onChange: (v: string) => void; rows?: number
}) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      rows={rows} style={{ ...inputBase, resize: 'vertical' }}
    />
  )
}
