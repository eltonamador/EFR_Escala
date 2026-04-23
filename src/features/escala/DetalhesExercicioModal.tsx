import type { AppState, Exercicio } from '../../types/domain.types'
import { getUsuarioNome } from '../../data/usuarios'
import { Modal } from '../../components/Modal'
import { StatusBadge } from '../../components/StatusBadge'
import { calcularStatus } from '../../lib/status-calculation'
import { verificarBloqueios, verificarAlertas } from '../../lib/validation-rules'

interface Props {
  exercicio: Exercicio
  state: AppState
  onClose: () => void
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 13 }}>
      <span style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', alignSelf: 'center' }}>{label}</span>
      <span style={{ color: 'var(--color-on-surface)' }}>{value}</span>
    </div>
  )
}

export function DetalhesExercicioModal({ exercicio: ex, state, onClose }: Props) {
  const outros = state.exercicios.filter(e => e.id !== ex.id)
  const status = calcularStatus(ex, outros)
  const bloqueios = verificarBloqueios(ex, outros)
  const alertas = verificarAlertas(ex, outros)

  const [y, m, d] = ex.data.split('-')
  const dataFmt = `${d}/${m}/${y}`

  return (
    <Modal titulo="Detalhes do Exercício" onClose={onClose} largura={460}>
      <Row label="Data" value={dataFmt} />
      <Row label="Exercício" value={`${ex.numero}º`} />
      <Row label="Chefe" value={getUsuarioNome(ex.chefe)} />
      <Row label="Auxiliar" value={getUsuarioNome(ex.auxiliar)} />
      <Row label="Segurança" value={getUsuarioNome(ex.seguranca)} />
      <Row label="Condições" value={getUsuarioNome(ex.condicoes)} />
      <Row label="Monitor 1" value={getUsuarioNome(ex.monitor1)} />
      <Row label="Monitor 2" value={getUsuarioNome(ex.monitor2)} />
      <Row label="Monitor 3" value={getUsuarioNome(ex.monitor3)} />

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-muted)' }}>Status</span>
        <StatusBadge status={status} />
      </div>

      {bloqueios.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {bloqueios.map((b, i) => (
            <div key={i} style={{ background: 'var(--color-conflito-bg)', color: 'var(--color-conflito-text)', borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12, marginBottom: 4 }}>
              ⛔ {b.descricao}
            </div>
          ))}
        </div>
      )}
      {alertas.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {alertas.map((a, i) => (
            <div key={i} style={{ background: 'var(--color-alerta-bg)', color: 'var(--color-alerta-text)', borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12, marginBottom: 4 }}>
              ⚠ {a.descricao}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{
          background: 'var(--color-primary)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
          fontFamily: 'var(--font-ui)', fontWeight: 600,
        }}>Fechar</button>
      </div>
    </Modal>
  )
}
