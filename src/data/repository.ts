import type { AppState, Exercicio, Solicitacao, StatusSolicitacao } from '../types/domain.types'

// Interface única de acesso a dados.
// Fase 1: implementação síncrona (localStorage).
// Fase 3: métodos de escrita viram async + App.tsx usa useEffect para hydrate.
export interface IRepository {
  hydrate(): AppState
  saveExercicio(ex: Exercicio, state: AppState): AppState
  appendSolicitacao(sol: Solicitacao, state: AppState): AppState
  updateSolicitacao(updated: Solicitacao, state: AppState): AppState
  updateSolicitacaoStatus(id: string, status: StatusSolicitacao, obs: string | null, state: AppState): AppState
  persistState(state: AppState): void
  reset(): AppState
}

let _repo: IRepository | null = null

export function getRepo(): IRepository {
  if (!_repo) throw new Error('Repository not initialized. Call initRepo() first.')
  return _repo
}

export function initRepo(repo: IRepository): void {
  _repo = repo
}
