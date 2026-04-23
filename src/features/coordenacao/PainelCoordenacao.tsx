import type { AppState } from '../../types/domain.types'
import { calcularMetricas } from '../../lib/metrics'
import { getUsuarioNome } from '../../data/usuarios'

interface Props { state: AppState }

interface MetricCardProps { label: string; value: number | string; accent?: string }

function MetricCard({ label, value, accent = 'var(--color-primary)' }: MetricCardProps) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      minWidth: 160,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.05em', textTransform: 'uppercase',
        color: 'var(--color-muted)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-ui)', fontSize: 32, fontWeight: 700,
        color: accent, lineHeight: 1,
      }}>{value}</div>
    </div>
  )
}

export function PainelCoordenacao({ state }: Props) {
  const m = calcularMetricas(state, getUsuarioNome)

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{
        fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 24,
        marginBottom: 20, color: 'var(--color-primary)',
      }}>Painel da Coordenação</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <MetricCard label="Total de Exercícios" value={m.totalExercicios} />
        <MetricCard label="Conflitos Bloqueantes" value={m.conflitos}
          accent={m.conflitos > 0 ? 'var(--color-conflito-text)' : 'var(--color-ok-text)'} />
        <MetricCard label="Alertas Fortes" value={m.alertas}
          accent={m.alertas > 0 ? 'var(--color-alerta-text)' : 'var(--color-ok-text)'} />
        <MetricCard label="Incompletos" value={m.incompletos}
          accent={m.incompletos > 0 ? 'var(--color-muted)' : 'var(--color-ok-text)'} />
        <MetricCard label="Solicitações Pendentes" value={m.solicitacoesPendentes}
          accent={m.solicitacoesPendentes > 0 ? 'var(--color-alerta-text)' : 'var(--color-ok-text)'} />
        <MetricCard label="Permutas Abertas" value={m.permutasAbertas} />
      </div>

      {m.distribuicaoCarga.length > 0 && (
        <div>
          <h2 style={{
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16,
            marginBottom: 12, color: 'var(--color-secondary)',
          }}>Distribuição de Carga</h2>
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            maxWidth: 480,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-low)' }}>
                  {['Instrutor', 'Total', 'Funções Quentes'].map(col => (
                    <th key={col} style={{
                      padding: '8px 12px', textAlign: 'left',
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: 'var(--color-secondary)', borderBottom: '1px solid var(--color-border)',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {m.distribuicaoCarga.map((row, i) => (
                  <tr key={row.nome} style={{
                    background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-low)',
                  }}>
                    <td style={tdStyle}>{row.nome}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{row.total}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 500,
                      color: row.quente > 2 ? 'var(--color-alerta-text)' : 'inherit' }}>{row.quente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: 13,
  color: 'var(--color-on-surface)',
  borderBottom: '1px solid var(--color-border)',
}
