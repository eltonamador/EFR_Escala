import type { AppState } from '../types/domain.types'
import { getEscalaFinal } from './escalaFinal'

// Fonte de verdade: data/escala_final_maio_2026_v3.xlsx
// Versão 3 — força bust do cache localStorage v1/v2
export const MOCK_STATE: AppState = {
  version: 3,
  exercicios: getEscalaFinal(),
  solicitacoes: [],
}
