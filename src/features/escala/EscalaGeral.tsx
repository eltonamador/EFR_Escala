import { useState, Fragment } from 'react'
import type { AppState, Exercicio } from '../../types/domain.types'
import { getUsuarioNome } from '../../data/usuarios'
import { StatusBadge } from '../../components/StatusBadge'
import { calcularStatusTodos } from '../../lib/status-calculation'
import { EditarExercicioModal } from './EditarExercicioModal'
import { DetalhesExercicioModal } from './DetalhesExercicioModal'
import { NovaSolicitacaoModal } from '../solicitacoes/NovaSolicitacaoModal'
import { NovoExercicioModal } from './NovoExercicioModal'
import { isAdmin } from '../../lib/admin'
import { getRepo } from '../../data/repository'

interface Props {
  state: AppState
  setState: (s: AppState) => void
}

type Modal =
  | { tipo: 'editar' | 'detalhes' | 'solicitacao'; exercicioId: string }
  | { tipo: 'novo' }
  | null

const DIAS: Record<string, string> = {
  '0': 'Dom', '1': 'Seg', '2': 'Ter', '3': 'Qua', '4': 'Qui', '5': 'Sex', '6': 'Sáb',
}

function formatData(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function getDiaSemana(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return DIAS[String(new Date(y, m - 1, d).getDay())]
}

// Retorna o número da semana ISO para agrupar visualmente
function getISOWeek(iso: string): number {
  const d = new Date(iso + 'T00:00:00')
  const jan4 = new Date(d.getFullYear(), 0, 4)
  const startOfWeek1 = new Date(jan4)
  startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7))
  return Math.floor((d.getTime() - startOfWeek1.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
}

export function EscalaGeral({ state, setState }: Props) {
  const [modal, setModal] = useState<Modal>(null)
  const admin = isAdmin()

  const sorted = calcularStatusTodos(state.exercicios).sort((a, b) =>
    a.data.localeCompare(b.data) || a.numero - b.numero
  )

  const modalEx = modal && modal.tipo !== 'novo' ? sorted.find(e => e.id === modal.exercicioId) : null

  function handleSaveEdicao(updated: Exercicio) {
    setState({
      ...state,
      exercicios: state.exercicios.map(e => e.id === updated.id ? updated : e),
    })
    setModal(null)
  }

  function handleSaveSolicitacao(sol: Parameters<typeof state.solicitacoes.push>[0]) {
    setState({ ...state, solicitacoes: [...state.solicitacoes, sol] })
    setModal(null)
  }

  function handleSaveNovo(ex: Exercicio) {
    setState(getRepo().appendExercicio(ex, state))
    setModal(null)
  }

  return (
    <div className="page-pad" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 24, color: 'var(--color-primary)' }}>
          Escala Geral
        </h1>
        {admin && <button onClick={() => setModal({ tipo: 'novo' })} style={{
          background: 'var(--color-primary)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius)', padding: '8px 18px', fontSize: 13,
          fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
        }}>+ Novo Exercício</button>}
      </div>

      {sorted.length === 0 && (
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center',
          color: 'var(--color-muted)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Nenhum exercício cadastrado</div>
          <div style={{ fontSize: 13 }}>Clique em "+ Novo Exercício" para começar.</div>
        </div>
      )}

      {/* Desktop: tabela */}
      {sorted.length > 0 && <div className="table-wrapper escala-table-wrap" style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-low)' }}>
              {['Data', 'Dia', 'Exercício', 'Chefe', 'Auxiliar', 'Segurança', 'Condições', 'Mon 1', 'Mon 2', 'Mon 3', 'Status', '']
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
            {sorted.map((ex, i) => {
              const semanaAtual = getISOWeek(ex.data)
              const semanAnterior = i > 0 ? getISOWeek(sorted[i - 1].data) : null
              const inicioNovaSemana = semanAnterior !== null && semanaAtual !== semanAnterior
              const semanaLabel = `Semana ${i === 0 ? 1 : 2} — ${ex.data.slice(0, 7).split('-').reverse().join('/')}`
              return (
              <Fragment key={ex.id}>
                {(i === 0 || inicioNovaSemana) && (
                  <tr key={`sem-${semanaAtual}`}>
                    <td colSpan={12} style={{
                      padding: '8px 12px',
                      background: 'var(--color-primary)',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{semanaLabel}</td>
                  </tr>
                )}
              <tr
                style={{
                  background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-low)',
                  borderLeft: ex.status === 'CONFLITO' ? '4px solid var(--color-conflito-text)' : 'none',
                }}
              >
                <td style={tdStyle}>{formatData(ex.data)}</td>
                <td style={tdStyle}>{getDiaSemana(ex.data)}</td>
                <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{ex.numero}º</td>
                <td style={tdStyle}>{getUsuarioNome(ex.chefe)}</td>
                <td style={tdStyle}>{getUsuarioNome(ex.auxiliar)}</td>
                <td style={tdStyle}>{getUsuarioNome(ex.seguranca)}</td>
                <td style={tdStyle}>{getUsuarioNome(ex.condicoes)}</td>
                <td style={tdStyle}>{getUsuarioNome(ex.monitor1)}</td>
                <td style={tdStyle}>{getUsuarioNome(ex.monitor2)}</td>
                <td style={tdStyle}>{getUsuarioNome(ex.monitor3)}</td>
                <td style={tdStyle}><StatusBadge status={ex.status} /></td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  <button onClick={() => setModal({ tipo: 'detalhes', exercicioId: ex.id })} style={btnGhost}>Ver</button>
                  {admin && <button onClick={() => setModal({ tipo: 'editar', exercicioId: ex.id })} style={btnGhost}>Editar</button>}
                  <button onClick={() => setModal({ tipo: 'solicitacao', exercicioId: ex.id })} style={btnGhost}>Solicitar</button>
                </td>
              </tr>
              </Fragment>
            )
            })}
          </tbody>
        </table>
      </div>}

      {/* Mobile: cards */}
      {sorted.length > 0 && (
        <div className="escala-cards">
          {sorted.map((ex, i) => {
            const semanaAtual = getISOWeek(ex.data)
            const semanAnterior = i > 0 ? getISOWeek(sorted[i - 1].data) : null
            const inicioNovaSemana = semanAnterior !== null && semanaAtual !== semanAnterior
            const semanaLabel = `Semana ${i === 0 ? 1 : 2} — ${ex.data.slice(0, 7).split('-').reverse().join('/')}`
            const funcoes = [
              { label: 'Chefe',     value: getUsuarioNome(ex.chefe),    req: true },
              { label: 'Auxiliar',  value: getUsuarioNome(ex.auxiliar), req: true },
              { label: 'Segurança', value: getUsuarioNome(ex.seguranca),req: true },
              { label: 'Condições', value: getUsuarioNome(ex.condicoes),req: true },
              { label: 'Monitor 1', value: ex.monitor1 ? getUsuarioNome(ex.monitor1) : null, req: false },
              { label: 'Monitor 2', value: ex.monitor2 ? getUsuarioNome(ex.monitor2) : null, req: false },
              { label: 'Monitor 3', value: ex.monitor3 ? getUsuarioNome(ex.monitor3) : null, req: false },
            ].filter(f => f.req || f.value)
            return (
              <Fragment key={`card-${ex.id}`}>
                {(i === 0 || inicioNovaSemana) && (
                  <div style={{
                    padding: '6px 12px', background: 'var(--color-primary)', color: '#fff',
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{semanaLabel}</div>
                )}
                <div style={{
                  background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)', overflow: 'hidden',
                  borderLeft: ex.status === 'CONFLITO' ? '4px solid var(--color-conflito-text)' : '1px solid var(--color-border)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: 'var(--color-surface-low)',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-ui)', color: 'var(--color-primary)' }}>
                        {formatData(ex.data)}
                      </span>
                      <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>{getDiaSemana(ex.data)}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
                        background: 'var(--color-primary)', color: '#fff',
                        padding: '1px 7px', borderRadius: 'var(--radius-sm)',
                      }}>{ex.numero}º</span>
                    </div>
                    <StatusBadge status={ex.status} />
                  </div>
                  <div style={{ padding: '8px 14px' }}>
                    {funcoes.map(({ label, value }) => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '5px 0', borderBottom: '1px solid var(--color-border)', fontSize: 13,
                      }}>
                        <span style={{
                          color: 'var(--color-muted)', fontFamily: 'var(--font-mono)',
                          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>{label}</span>
                        <span style={{ color: 'var(--color-on-surface)', fontWeight: 500 }}>
                          {value ?? '—'}
                        </span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      <button onClick={() => setModal({ tipo: 'detalhes', exercicioId: ex.id })} style={btnCard}>Ver</button>
                      {admin && <button onClick={() => setModal({ tipo: 'editar', exercicioId: ex.id })} style={btnCard}>Editar</button>}
                      <button onClick={() => setModal({ tipo: 'solicitacao', exercicioId: ex.id })} style={btnCard}>Solicitar</button>
                    </div>
                  </div>
                </div>
              </Fragment>
            )
          })}
        </div>
      )}

      {modal && modalEx && modal.tipo === 'editar' && (
        <EditarExercicioModal
          exercicio={modalEx} state={state}
          onSave={handleSaveEdicao} onClose={() => setModal(null)}
        />
      )}
      {modal && modalEx && modal.tipo === 'detalhes' && (
        <DetalhesExercicioModal
          exercicio={modalEx} state={state} onClose={() => setModal(null)}
        />
      )}
      {modal && modalEx && modal.tipo === 'solicitacao' && (
        <NovaSolicitacaoModal
          exercicio={modalEx}
          todosExercicios={state.exercicios}
          onSave={handleSaveSolicitacao} onClose={() => setModal(null)}
        />
      )}
      {modal && modal.tipo === 'novo' && (
        <NovoExercicioModal
          state={state} onSave={handleSaveNovo} onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: 13,
  color: 'var(--color-on-surface)',
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
}

const btnGhost: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--color-secondary)',
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
  padding: '2px 8px', borderRadius: 'var(--radius)', cursor: 'pointer',
  textDecoration: 'underline',
}

const btnCard: React.CSSProperties = {
  background: 'var(--color-surface-low)', border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)', padding: '6px 14px', fontSize: 12,
  fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
  color: 'var(--color-secondary)',
}
