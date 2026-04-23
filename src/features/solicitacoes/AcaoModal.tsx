import { useState } from 'react'
import type { AppState, Solicitacao } from '../../types/domain.types'
import { USUARIOS } from '../../data/usuarios'
import { Modal } from '../../components/Modal'
import { FormField, Select, TextArea } from '../../components/FormField'
import {
  abrirParaPermuta, assumirPermuta,
  aprovarSolicitacao, rejeitarSolicitacao,
} from '../../lib/solicitacao-actions'

export type TipoAcao = 'ABRIR_PERMUTA' | 'ASSUMIR' | 'APROVAR' | 'REJEITAR'

interface Props {
  acao: TipoAcao
  sol: Solicitacao
  state: AppState
  onConfirm: (nextState: AppState) => void
  onClose: () => void
}

const titulos: Record<TipoAcao, string> = {
  ABRIR_PERMUTA: 'Abrir para Permuta',
  ASSUMIR: 'Assumir Permuta',
  APROVAR: 'Aprovar Solicitação',
  REJEITAR: 'Rejeitar Solicitação',
}

export function AcaoModal({ acao, sol, state, onConfirm, onClose }: Props) {
  const [interessadoId, setInteressadoId] = useState('')
  const [observacao, setObservacao] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  const elegiveisAssumirFuncao = USUARIOS.filter(u =>
    u.habilitacoes.includes(sol.funcao) && u.id !== sol.solicitanteId
  )

  function handleConfirm() {
    setErro(null)
    let result
    if (acao === 'ABRIR_PERMUTA') result = abrirParaPermuta(state, sol.id)
    else if (acao === 'ASSUMIR') result = assumirPermuta(state, sol.id, interessadoId)
    else if (acao === 'APROVAR') result = aprovarSolicitacao(state, sol.id, observacao)
    else result = rejeitarSolicitacao(state, sol.id, observacao)

    if (!result.ok) { setErro(result.erro ?? 'Erro desconhecido.'); return }
    onConfirm(result.state!)
  }

  const canConfirm = acao !== 'ASSUMIR' || interessadoId !== ''

  return (
    <Modal titulo={titulos[acao]} onClose={onClose} largura={420}>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>
        Exercício {sol.exercicioNumero}º — {sol.data.split('-').reverse().join('/')} — {sol.funcao}
      </p>

      {acao === 'ASSUMIR' && (
        <FormField label="Interessado *">
          <Select value={interessadoId} onChange={setInteressadoId}>
            <option value="" disabled>Selecione</option>
            {elegiveisAssumirFuncao.map(u => (
              <option key={u.id} value={u.id}>{u.nome}</option>
            ))}
          </Select>
        </FormField>
      )}

      {(acao === 'APROVAR' || acao === 'REJEITAR') && (
        <FormField label="Observação (opcional)">
          <TextArea value={observacao} onChange={setObservacao} rows={2} />
        </FormField>
      )}

      {erro && (
        <div style={{
          background: 'var(--color-conflito-bg)', color: 'var(--color-conflito-text)',
          borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: 12, marginBottom: 12,
        }}>⛔ {erro}</div>
      )}

      {acao === 'ABRIR_PERMUTA' && (
        <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>
          A solicitação ficará visível para outros instrutores elegíveis assumirem.
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
        <button onClick={onClose} style={btnSecondary}>Cancelar</button>
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          style={{
            ...btnPrimary,
            opacity: canConfirm ? 1 : 0.4,
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            background: acao === 'REJEITAR' ? 'var(--color-conflito-text)' : 'var(--color-primary)',
          }}
        >{titulos[acao]}</button>
      </div>
    </Modal>
  )
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--color-primary)', color: '#fff', border: 'none',
  borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
  fontFamily: 'var(--font-ui)', fontWeight: 600,
}
const btnSecondary: React.CSSProperties = {
  background: 'none', color: 'var(--color-secondary)',
  border: '1px solid var(--color-border-variant)',
  borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
  fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
}
