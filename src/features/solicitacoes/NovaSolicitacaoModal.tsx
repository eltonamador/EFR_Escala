import { useState, useEffect } from 'react'
import type { Exercicio, Funcao, Solicitacao } from '../../types/domain.types'
import { USUARIOS, getUsuarioById } from '../../data/usuarios'
import { Modal } from '../../components/Modal'
import { FormField, Select } from '../../components/FormField'
import { verificarBloqueios } from '../../lib/validation-rules'

interface Props {
  exercicio: Exercicio
  todosExercicios: Exercicio[]
  onSave: (sol: Solicitacao) => void
  onClose: () => void
}

const FUNCAO_LABEL: Record<Funcao, string> = {
  chefe: 'Chefe', auxiliar: 'Auxiliar', seguranca: 'Segurança', condicoes: 'Condições',
  monitor1: 'Monitor 1', monitor2: 'Monitor 2', monitor3: 'Monitor 3',
}

const FUNCOES: Funcao[] = ['chefe', 'auxiliar', 'seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3']

function getAlocados(ex: Exercicio): Array<{ id: string; funcoes: Funcao[] }> {
  const campos: Array<[string | null, Funcao]> = [
    [ex.chefe, 'chefe'], [ex.auxiliar, 'auxiliar'], [ex.seguranca, 'seguranca'],
    [ex.condicoes, 'condicoes'], [ex.monitor1, 'monitor1'],
    [ex.monitor2, 'monitor2'], [ex.monitor3, 'monitor3'],
  ]
  const map = new Map<string, Funcao[]>()
  for (const [id, funcao] of campos) {
    if (!id) continue
    if (!map.has(id)) map.set(id, [])
    map.get(id)!.push(funcao)
  }
  return Array.from(map.entries()).map(([id, funcoes]) => ({ id, funcoes }))
}

// Retorna todos os exercícios onde o usuário está alocado, com sua função em cada um
function getExerciciosDoUsuario(uid: string, todos: Exercicio[]): Array<{ ex: Exercicio; funcao: Funcao }> {
  const result: Array<{ ex: Exercicio; funcao: Funcao }> = []
  for (const ex of todos) {
    for (const f of FUNCOES) {
      if ((ex[f as keyof Exercicio] as string | null) === uid) {
        result.push({ ex, funcao: f })
      }
    }
  }
  return result.sort((a, b) => a.ex.data.localeCompare(b.ex.data) || a.ex.numero - b.ex.numero)
}

function formatData(iso: string) {
  return iso.split('-').reverse().join('/')
}

export function NovaSolicitacaoModal({ exercicio, todosExercicios, onSave, onClose }: Props) {
  const alocados = getAlocados(exercicio)
  const primeiroPerId = alocados[0]?.id ?? ''

  const [solicitanteId, setSolicitanteId] = useState(primeiroPerId)
  const [funcao, setFuncao] = useState<Funcao>(alocados[0]?.funcoes[0] ?? 'chefe')
  const tipo = 'PERMUTA' as const
  const [substitutoId, setSubstitutoId] = useState('')
  const [permutaKey, setPermutaKey] = useState('') // "exId|funcao"

  useEffect(() => {
    const entrada = alocados.find(a => a.id === solicitanteId)
    if (entrada?.funcoes[0]) setFuncao(entrada.funcoes[0])
  }, [solicitanteId])

  useEffect(() => { setSubstitutoId(''); setPermutaKey('') }, [funcao])
  useEffect(() => { setPermutaKey('') }, [substitutoId])

  const funcoesDoSolicitante = alocados.find(a => a.id === solicitanteId)?.funcoes ?? []
  const usuariosElegiveis = USUARIOS.filter(u => u.habilitacoes.includes(funcao) && u.id !== solicitanteId)

  // Exercícios do substituto — inclui mesmo exercício se a função for diferente
  const exerciciosDoSubstituto = substitutoId
    ? getExerciciosDoUsuario(substitutoId, todosExercicios).filter(
        ({ ex, funcao: f }) => !(ex.id === exercicio.id && f === funcao)
      )
    : []

  const permutaSelecionada = permutaKey
    ? exerciciosDoSubstituto.find(({ ex, funcao: f }) => `${ex.id}|${f}` === permutaKey) ?? null
    : null

  const isMesmoExercicio = permutaSelecionada?.ex.id === exercicio.id
  // Substituto já está no mesmo exercício em outra função
  const substitutoNoMesmoExercicio = substitutoId !== '' && alocados.some(a => a.id === substitutoId)

  // Bloqueio: substituto assumindo o slot do solicitante
  const bloqueiosSubstituto = (() => {
    if (!substitutoId) return []
    const exSim = isMesmoExercicio && permutaSelecionada
      ? { ...exercicio, [funcao]: substitutoId, [permutaSelecionada.funcao]: solicitanteId } as Exercicio
      : { ...exercicio, [funcao]: substitutoId } as Exercicio
    const all = verificarBloqueios(exSim, todosExercicios)
    // Suprime falso DUPLICIDADE enquanto permuta do mesmo exercício não foi selecionada
    return substitutoNoMesmoExercicio && !permutaSelecionada
      ? all.filter(b => b.tipo !== 'DUPLICIDADE_EXERCICIO')
      : all
  })()

  // Bloqueio: solicitante assumindo o slot do substituto (só para exercícios diferentes)
  const bloqueiosSolicitante = permutaSelecionada && !isMesmoExercicio
    ? verificarBloqueios(
        { ...permutaSelecionada.ex, [permutaSelecionada.funcao]: solicitanteId } as Exercicio,
        todosExercicios,
      )
    : []

  const podeSalvar = solicitanteId !== '' && substitutoId !== '' && permutaKey !== ''

  function handleSave() {
    if (!podeSalvar || !permutaSelecionada) return
    const sol: Solicitacao = {
      id: `sol-${Date.now()}`,
      solicitanteId,
      data: exercicio.data,
      exercicioNumero: exercicio.numero,
      funcao,
      tipo,
      justificativa: '',
      substitutoSugeridoId: substitutoId,
      exercicioPermutaId: permutaSelecionada.ex.id,
      funcaoPermuta: permutaSelecionada.funcao,
      interessadoId: null,
      observacaoCoordenacao: null,
      status: 'PENDENTE',
      criadoEm: new Date().toISOString(),
    }
    onSave(sol)
  }

  if (alocados.length === 0) {
    return (
      <Modal titulo="Abrir Solicitação" onClose={onClose} largura={400}>
        <p style={{ color: 'var(--color-muted)', fontSize: 13, marginBottom: 20 }}>
          Este exercício não tem nenhum usuário alocado. Edite-o primeiro.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={btnPrimary}>Fechar</button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal titulo="Abrir Solicitação" onClose={onClose} largura={500}>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 14 }}>
        Exercício {exercicio.numero}º — {formatData(exercicio.data)}
      </p>

      {/* Lado A: solicitante sai */}
      <div style={secaoStyle}>
        <div style={secaoTituloStyle}>Quem sai</div>

        <FormField label="Solicitante *">
          <Select value={solicitanteId} onChange={setSolicitanteId}>
            {alocados.map(a => (
              <option key={a.id} value={a.id}>{getUsuarioById(a.id)?.nome ?? a.id}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Função *">
          <Select value={funcao} onChange={v => setFuncao(v as Funcao)}>
            {funcoesDoSolicitante.length > 0
              ? funcoesDoSolicitante.map(f => <option key={f} value={f}>{FUNCAO_LABEL[f]}</option>)
              : <option value={funcao}>{FUNCAO_LABEL[funcao]}</option>
            }
          </Select>
        </FormField>

        <FormField label="Substituto (quem entra no lugar) *">
          <Select value={substitutoId} onChange={setSubstitutoId}>
            <option value="">— Selecionar —</option>
            {usuariosElegiveis.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </Select>
        </FormField>

        {bloqueiosSubstituto.length > 0 && <BloqueioBox bloqueios={bloqueiosSubstituto} />}
      </div>

      {/* Lado B: solicitante cobre o dia do substituto */}
      {substitutoId !== '' && (
        <div style={{ ...secaoStyle, marginTop: 12 }}>
          <div style={secaoTituloStyle}>O que o solicitante assume em troca</div>

          {exerciciosDoSubstituto.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: '6px 0' }}>
              {getUsuarioById(substitutoId)?.nome} não está alocado em nenhum exercício para permutar.
            </p>
          ) : (
            <FormField label="Slot do substituto *">
              <Select value={permutaKey} onChange={setPermutaKey}>
                <option value="">— Selecionar —</option>
                {exerciciosDoSubstituto.map(({ ex, funcao: f }) => (
                  <option key={`${ex.id}|${f}`} value={`${ex.id}|${f}`}>
                    {ex.id === exercicio.id
                      ? `Mesmo exercício — como ${FUNCAO_LABEL[f]}`
                      : `${formatData(ex.data)} — ${ex.numero}º — como ${FUNCAO_LABEL[f]}`}
                  </option>
                ))}
              </Select>
            </FormField>
          )}

          {bloqueiosSolicitante.length > 0 && <BloqueioBox bloqueios={bloqueiosSolicitante} />}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
        <button onClick={onClose} style={btnSecondary}>Cancelar</button>
        <button
          onClick={handleSave}
          disabled={!podeSalvar}
          style={{ ...btnPrimary, opacity: podeSalvar ? 1 : 0.4, cursor: podeSalvar ? 'pointer' : 'not-allowed' }}
        >Enviar</button>
      </div>
    </Modal>
  )
}

function BloqueioBox({ bloqueios }: { bloqueios: Array<{ descricao: string }> }) {
  return (
    <div style={{
      marginTop: 6,
      background: 'var(--color-conflito-bg)', border: '1px solid var(--color-conflito-text)',
      borderRadius: 'var(--radius)', padding: '8px 12px',
    }}>
      {bloqueios.map((b, i) => (
        <div key={i} style={{ fontSize: 12, color: 'var(--color-conflito-text)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 }}>
          ⚠ {b.descricao}
        </div>
      ))}
    </div>
  )
}

const secaoStyle: React.CSSProperties = {
  background: 'var(--color-surface-low)', border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)', padding: '12px 14px',
}

const secaoTituloStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
  letterSpacing: '0.07em', textTransform: 'uppercase',
  color: 'var(--color-secondary)', marginBottom: 10,
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--color-primary)', color: '#fff', border: 'none',
  borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
  fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
}
const btnSecondary: React.CSSProperties = {
  background: 'none', color: 'var(--color-secondary)',
  border: '1px solid var(--color-border-variant)',
  borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
  fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
}
