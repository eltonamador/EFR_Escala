import { useState } from 'react'
import type { AppState, Solicitacao } from '../../types/domain.types'
import { getUsuarioNome } from '../../data/usuarios'
import { DetalhesSolicitacaoModal } from './DetalhesSolicitacaoModal'
import { AcaoModal, type TipoAcao } from './AcaoModal'

interface Props {
  state: AppState
  setState: (s: AppState) => void
}

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDENTE:       { bg: 'var(--color-alerta-bg)',    color: 'var(--color-alerta-text)' },
  ABERTA_PERMUTA: { bg: '#ede9fe',                   color: '#5b21b6' },
  ASSUMIDA:       { bg: '#dbeafe',                   color: '#1e40af' },
  APROVADA:       { bg: 'var(--color-ok-bg)',         color: 'var(--color-ok-text)' },
  REJEITADA:      { bg: 'var(--color-conflito-bg)',   color: 'var(--color-conflito-text)' },
  CANCELADA:      { bg: 'var(--color-incompleto-bg)', color: 'var(--color-incompleto-text)' },
}

const funcaoLabel: Record<string, string> = {
  chefe: 'Chefe', auxiliar: 'Auxiliar', seguranca: 'Segurança', condicoes: 'Condições',
  monitor1: 'Monitor 1', monitor2: 'Monitor 2', monitor3: 'Monitor 3',
}

const statusLabel: Record<string, string> = {
  PENDENTE: 'Pendente', ABERTA_PERMUTA: 'Aberta Permuta', ASSUMIDA: 'Assumida',
  APROVADA: 'Aprovada', REJEITADA: 'Rejeitada', CANCELADA: 'Cancelada',
}

const FILTROS = ['TODOS', 'PENDENTE', 'ABERTA_PERMUTA', 'ASSUMIDA', 'APROVADA', 'REJEITADA']

type ModalState = { tipo: 'detalhes' | TipoAcao; solId: string } | null

function acoesPossiveis(sol: Solicitacao): TipoAcao[] {
  if (sol.status === 'PENDENTE' && sol.tipo === 'PERMUTA') return ['ABRIR_PERMUTA', 'APROVAR', 'REJEITAR']
  if (sol.status === 'PENDENTE') return ['APROVAR', 'REJEITAR']
  if (sol.status === 'ABERTA_PERMUTA') return ['ASSUMIR', 'REJEITAR']
  if (sol.status === 'ASSUMIDA') return ['APROVAR', 'REJEITAR']
  return []
}

export function SolicitacoesList({ state, setState }: Props) {
  const [filtro, setFiltro] = useState('TODOS')
  const [modal, setModal] = useState<ModalState>(null)

  const lista = state.solicitacoes.filter(s =>
    filtro === 'TODOS' || s.status === filtro
  ).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  const modalSol = modal ? state.solicitacoes.find(s => s.id === modal.solId) : null

  function handleConfirm(next: AppState) { setState(next); setModal(null) }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{
        fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 24,
        marginBottom: 8, color: 'var(--color-primary)',
      }}>Solicitações e Permutas</h1>

      <p style={{
        fontSize: 13, color: 'var(--color-secondary)',
        background: 'var(--color-surface-low)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16,
        fontFamily: 'var(--font-ui)',
      }}>
        Após abrir uma solicitação, entre em contato com o substituto desejado e peça que ele acesse
        o sistema para assumir a vaga. A coordenação aprova ou rejeita após a confirmação do substituto.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTROS.map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: '5px 14px', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border-variant)',
            background: filtro === f ? 'var(--color-primary)' : 'var(--color-surface)',
            color: filtro === f ? '#fff' : 'var(--color-secondary)',
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
          }}>{statusLabel[f] ?? f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-muted)' }}>
          {lista.length} registro{lista.length !== 1 ? 's' : ''}
        </span>
      </div>

      {lista.length === 0 ? (
        <p style={{ color: 'var(--color-muted)', padding: '24px 0' }}>Nenhuma solicitação encontrada.</p>
      ) : (
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-low)' }}>
                {['Solicitante', 'Data', 'Exerc.', 'Função', 'Tipo', 'Interessado', 'Status', 'Ações']
                  .map(col => (
                    <th key={col} style={{
                      padding: '8px 12px', textAlign: 'left',
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: 'var(--color-secondary)', borderBottom: '1px solid var(--color-border)',
                      whiteSpace: 'nowrap',
                    }}>{col}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {lista.map((sol, i) => {
                const sc = statusColors[sol.status] ?? statusColors['PENDENTE']
                const acoes = acoesPossiveis(sol)
                return (
                  <tr key={sol.id} style={{
                    background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-low)',
                  }}>
                    <td style={tdStyle}>{getUsuarioNome(sol.solicitanteId)}</td>
                    <td style={tdStyle}>{sol.data.split('-').reverse().join('/')}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{sol.exercicioNumero}º</td>
                    <td style={tdStyle}>{funcaoLabel[sol.funcao] ?? sol.funcao}</td>
                    <td style={tdStyle}>{sol.tipo === 'PERMUTA' ? 'Permuta' : 'Substituição'}</td>
                    <td style={tdStyle}>{getUsuarioNome(sol.interessadoId)}</td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)', background: sc.bg, color: sc.color,
                        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>{statusLabel[sol.status] ?? sol.status}</span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <button onClick={() => setModal({ tipo: 'detalhes', solId: sol.id })} style={btnGhost}>Ver</button>
                      {acoes.map(a => (
                        <button key={a} onClick={() => setModal({ tipo: a, solId: sol.id })} style={{
                          ...btnGhost,
                          color: a === 'REJEITAR' ? 'var(--color-conflito-text)' :
                                 a === 'APROVAR' ? 'var(--color-ok-text)' : 'var(--color-secondary)',
                        }}>
                          {a === 'ABRIR_PERMUTA' ? 'Permuta' :
                           a === 'ASSUMIR' ? 'Assumir' :
                           a === 'APROVAR' ? 'Aprovar' : 'Rejeitar'}
                        </button>
                      ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && modalSol && modal.tipo === 'detalhes' && (
        <DetalhesSolicitacaoModal sol={modalSol} onClose={() => setModal(null)} />
      )}
      {modal && modalSol && modal.tipo !== 'detalhes' && (
        <AcaoModal
          acao={modal.tipo as TipoAcao}
          sol={modalSol}
          state={state}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: 13, color: 'var(--color-on-surface)',
  borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap',
}

const btnGhost: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--color-secondary)',
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
  padding: '2px 6px', borderRadius: 'var(--radius)', cursor: 'pointer',
  textDecoration: 'underline',
}
