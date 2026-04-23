import type { StatusExercicio } from '../types/domain.types'

const config: Record<StatusExercicio, { label: string; bg: string; color: string }> = {
  OK:         { label: 'OK',         bg: 'var(--color-ok-bg)',         color: 'var(--color-ok-text)' },
  ALERTA:     { label: 'ALERTA',     bg: 'var(--color-alerta-bg)',     color: 'var(--color-alerta-text)' },
  CONFLITO:   { label: 'CONFLITO',   bg: 'var(--color-conflito-bg)',   color: 'var(--color-conflito-text)' },
  INCOMPLETO: { label: 'INCOMPLETO', bg: 'var(--color-incompleto-bg)', color: 'var(--color-incompleto-text)' },
}

interface Props { status: StatusExercicio }

export function StatusBadge({ status }: Props) {
  const { label, bg, color } = config[status]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 'var(--radius-sm)',
      background: bg,
      color,
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
