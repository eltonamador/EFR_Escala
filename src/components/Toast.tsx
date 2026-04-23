import { useEffect } from 'react'

export interface ToastMsg { tipo: 'sucesso' | 'erro'; texto: string }

interface Props {
  msg: ToastMsg | null
  onDismiss: () => void
}

export function Toast({ msg, onDismiss }: Props) {
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [msg, onDismiss])

  if (!msg) return null

  const isErro = msg.tipo === 'erro'
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
      background: isErro ? 'var(--color-conflito-text)' : '#166534',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: '12px 20px',
      fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      maxWidth: 360,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span>{isErro ? '⛔' : '✓'}</span>
      <span style={{ flex: 1 }}>{msg.texto}</span>
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
        fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1,
      }}>×</button>
    </div>
  )
}
