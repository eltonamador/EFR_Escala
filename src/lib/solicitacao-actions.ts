import type { AppState, Exercicio, Funcao } from '../types/domain.types'
import { getUsuarioById } from '../data/usuarios'
import { verificarBloqueios } from './validation-rules'

export interface AcaoResult {
  ok: boolean
  erro?: string
  state?: AppState
}

// PENDENTE (PERMUTA) → ABERTA_PERMUTA
export function abrirParaPermuta(state: AppState, solId: string): AcaoResult {
  const sol = state.solicitacoes.find(s => s.id === solId)
  if (!sol || sol.tipo !== 'PERMUTA' || sol.status !== 'PENDENTE') {
    return { ok: false, erro: 'Solicitação não elegível para permuta aberta.' }
  }
  return {
    ok: true,
    state: {
      ...state,
      solicitacoes: state.solicitacoes.map(s =>
        s.id === solId ? { ...s, status: 'ABERTA_PERMUTA' } : s
      ),
    },
  }
}

// ABERTA_PERMUTA → ASSUMIDA
export function assumirPermuta(state: AppState, solId: string, interessadoId: string): AcaoResult {
  const sol = state.solicitacoes.find(s => s.id === solId)
  if (!sol || sol.status !== 'ABERTA_PERMUTA') {
    return { ok: false, erro: 'Solicitação não está aberta para permuta.' }
  }

  const usuario = getUsuarioById(interessadoId)
  if (!usuario) return { ok: false, erro: 'Usuário não encontrado.' }
  if (!usuario.habilitacoes.includes(sol.funcao)) {
    return { ok: false, erro: `${usuario.nome} não está habilitado para ${sol.funcao}.` }
  }

  const exercicio = state.exercicios.find(
    e => e.data === sol.data && e.numero === sol.exercicioNumero
  )
  if (exercicio) {
    const isMesmoExercicio = sol.exercicioPermutaId === exercicio.id
    const simulado: Exercicio = isMesmoExercicio && sol.funcaoPermuta
      ? { ...exercicio, [sol.funcao]: interessadoId, [sol.funcaoPermuta]: sol.solicitanteId }
      : { ...exercicio, [sol.funcao]: interessadoId }
    const outros = state.exercicios.filter(e => e.id !== exercicio.id)
    const bloqueios = verificarBloqueios(simulado, outros).filter(
      b => b.tipo === 'DUPLICIDADE_EXERCICIO' || b.tipo === 'EXCESSO_DIA'
    )
    if (bloqueios.length > 0) {
      return { ok: false, erro: bloqueios[0].descricao }
    }
  }

  return {
    ok: true,
    state: {
      ...state,
      solicitacoes: state.solicitacoes.map(s =>
        s.id === solId ? { ...s, status: 'ASSUMIDA', interessadoId } : s
      ),
    },
  }
}

// → APROVADA (atualiza escala se houver substituto)
export function aprovarSolicitacao(state: AppState, solId: string, observacao: string): AcaoResult {
  const sol = state.solicitacoes.find(s => s.id === solId)
  if (!sol || !['PENDENTE', 'ABERTA_PERMUTA', 'ASSUMIDA'].includes(sol.status)) {
    return { ok: false, erro: 'Solicitação não pode ser aprovada neste estado.' }
  }

  const substitutoId = sol.interessadoId ?? sol.substitutoSugeridoId
  let exercicios = state.exercicios

  if (substitutoId) {
    // Lado A: substituto entra no slot do solicitante
    exercicios = exercicios.map(e => {
      if (e.data !== sol.data || e.numero !== sol.exercicioNumero) return e
      return { ...e, [sol.funcao as Funcao]: substitutoId }
    })
    // Lado B (permuta): solicitante entra no slot do substituto
    if (sol.exercicioPermutaId && sol.funcaoPermuta) {
      exercicios = exercicios.map(e => {
        if (e.id !== sol.exercicioPermutaId) return e
        return { ...e, [sol.funcaoPermuta as Funcao]: sol.solicitanteId }
      })
    }
  }

  return {
    ok: true,
    state: {
      ...state,
      exercicios,
      solicitacoes: state.solicitacoes.map(s =>
        s.id === solId
          ? { ...s, status: 'APROVADA', observacaoCoordenacao: observacao || null }
          : s
      ),
    },
  }
}

// → REJEITADA (não altera escala)
export function rejeitarSolicitacao(state: AppState, solId: string, observacao: string): AcaoResult {
  const sol = state.solicitacoes.find(s => s.id === solId)
  if (!sol || ['APROVADA', 'REJEITADA', 'CANCELADA'].includes(sol.status)) {
    return { ok: false, erro: 'Solicitação já finalizada.' }
  }
  return {
    ok: true,
    state: {
      ...state,
      solicitacoes: state.solicitacoes.map(s =>
        s.id === solId
          ? { ...s, status: 'REJEITADA', observacaoCoordenacao: observacao || null }
          : s
      ),
    },
  }
}
