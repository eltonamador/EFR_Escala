import { type ReactNode } from 'react'

interface Props {
  titulo: string
  onClose: () => void
  children: ReactNode
  largura?: number
}

export function Modal({ titulo, onClose, children, largura = 560 }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
          width: '100%', maxWidth: largura, maxHeight: '90vh',
          overflow: 'auto', boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16, color: 'var(--color-primary)' }}>
            {titulo}
          </span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 20, color: 'var(--color-muted)',
            lineHeight: 1, padding: '0 4px',
          }}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
