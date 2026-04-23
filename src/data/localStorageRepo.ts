import type { AppState, Exercicio, Solicitacao, StatusSolicitacao } from '../types/domain.types'
import type { IRepository } from './repository'
import { MOCK_STATE } from './mockState'

const STORAGE_KEY = 'efr-escala-v1'

export const localStorageRepo: IRepository = {
  hydrate(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return structuredClone(MOCK_STATE)
      const parsed = JSON.parse(raw) as AppState
      if (parsed.version !== MOCK_STATE.version) return structuredClone(MOCK_STATE)
      return parsed
    } catch {
      return structuredClone(MOCK_STATE)
    }
  },

  saveExercicio(ex: Exercicio, state: AppState): AppState {
    const next: AppState = {
      ...state,
      exercicios: state.exercicios.map(e => e.id === ex.id ? ex : e),
    }
    this.persistState(next)
    return next
  },

  appendExercicio(ex: Exercicio, state: AppState): AppState {
    const next: AppState = { ...state, exercicios: [...state.exercicios, ex] }
    this.persistState(next)
    return next
  },

  appendSolicitacao(sol: Solicitacao, state: AppState): AppState {
    const next: AppState = { ...state, solicitacoes: [...state.solicitacoes, sol] }
    this.persistState(next)
    return next
  },

  updateSolicitacao(updated: Solicitacao, state: AppState): AppState {
    const next: AppState = {
      ...state,
      solicitacoes: state.solicitacoes.map(s => s.id === updated.id ? updated : s),
    }
    this.persistState(next)
    return next
  },

  updateSolicitacaoStatus(
    id: string, status: StatusSolicitacao, obs: string | null, state: AppState
  ): AppState {
    const next: AppState = {
      ...state,
      solicitacoes: state.solicitacoes.map(s =>
        s.id === id ? { ...s, status, observacaoCoordenacao: obs ?? s.observacaoCoordenacao } : s
      ),
    }
    this.persistState(next)
    return next
  },

  persistState(state: AppState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  reset(): AppState {
    localStorage.removeItem(STORAGE_KEY)
    return structuredClone(MOCK_STATE)
  },
}
