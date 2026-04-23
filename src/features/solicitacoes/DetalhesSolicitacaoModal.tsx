import type { Solicitacao } from '../../types/domain.types'
import { getUsuarioNome } from '../../data/usuarios'
import { Modal } from '../../components/Modal'

const funcaoLabel: Record<string, string> = {
  chefe: 'Chefe', auxiliar: 'Auxiliar', seguranca: 'Segurança', condicoes: 'Condições',
  monitor1: 'Monitor 1', monitor2: 'Monitor 2', monitor3: 'Monitor 3',
}

const statusLabel: Record<string, string> = {
  PENDENTE: 'Pendente', ABERTA_PERMUTA: 'Aberta para Permuta', ASSUMIDA: 'Assumida',
  APROVADA: 'Aprovada', REJEITADA: 'Rejeitada', CANCELADA: 'Cancelada',
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 13 }}>
      <span style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', alignSelf: 'center' }}>{label}</span>
      <span style={{ color: 'var(--color-on-surface)', textAlign: 'right', maxWidth: 260 }}>{value}</span>
    </div>
  )
}

interface Props { sol: Solicitacao; onClose: () => void }

export function DetalhesSolicitacaoModal({ sol, onClose }: Props) {
  return (
    <Modal titulo="Detalhes da Solicitação" onClose={onClose} largura={460}>
      <Row label="Solicitante" value={getUsuarioNome(sol.solicitanteId)} />
      <Row label="Data" value={sol.data.split('-').reverse().join('/')} />
      <Row label="Exercício" value={`${sol.exercicioNumero}º`} />
      <Row label="Função" value={funcaoLabel[sol.funcao] ?? sol.funcao} />
      <Row label="Tipo" value={sol.tipo === 'PERMUTA' ? 'Permuta' : 'Substituição'} />
      <Row label="Justificativa" value={sol.justificativa} />
      <Row label="Substituto Sugerido" value={getUsuarioNome(sol.substitutoSugeridoId)} />
      <Row label="Interessado" value={getUsuarioNome(sol.interessadoId)} />
      <Row label="Status" value={statusLabel[sol.status] ?? sol.status} />
      {sol.observacaoCoordenacao && (
        <Row label="Observação" value={sol.observacaoCoordenacao} />
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={onClose} style={{
          background: 'var(--color-primary)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
          fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
        }}>Fechar</button>
      </div>
    </Modal>
  )
}
