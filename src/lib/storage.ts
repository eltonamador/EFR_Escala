import type { AppState } from '../types/domain.types'

// Operações de administração (export/import JSON).
// Hydrate, save e reset foram movidos para src/data/localStorageRepo.ts.

export function exportJSON(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `efr-escala-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function validateImport(raw: unknown): { ok: true; state: AppState } | { ok: false; erro: string } {
  if (typeof raw !== 'object' || raw === null) return { ok: false, erro: 'JSON inválido.' }
  const obj = raw as Record<string, unknown>
  if (typeof obj.version !== 'number') return { ok: false, erro: 'Campo "version" ausente ou inválido.' }
  if (!Array.isArray(obj.exercicios)) return { ok: false, erro: 'Campo "exercicios" ausente ou inválido.' }
  if (!Array.isArray(obj.solicitacoes)) return { ok: false, erro: 'Campo "solicitacoes" ausente ou inválido.' }
  return { ok: true, state: raw as AppState }
}
