import type { AppState, Exercicio } from '../types/domain.types'
import { calcularStatusTodos } from './status-calculation'

export interface PainelMetrics {
  totalExercicios: number
  conflitos: number
  alertas: number
  incompletos: number
  ok: number
  solicitacoesPendentes: number
  permutasAbertas: number
  distribuicaoCarga: Array<{ nome: string; total: number; quente: number }>
}

export function calcularMetricas(state: AppState, usuariosNome: (id: string) => string): PainelMetrics {
  const exComStatus = calcularStatusTodos(state.exercicios)

  const conflitos = exComStatus.filter(e => e.status === 'CONFLITO').length
  const alertas = exComStatus.filter(e => e.status === 'ALERTA').length
  const incompletos = exComStatus.filter(e => e.status === 'INCOMPLETO').length
  const ok = exComStatus.filter(e => e.status === 'OK').length

  const sols = state.solicitacoes
  const solicitacoesPendentes = sols.filter(s => s.status === 'PENDENTE').length
  const permutasAbertas = sols.filter(s => s.tipo === 'PERMUTA' && s.status === 'PENDENTE').length

  // distribuição de carga
  const carga: Record<string, { total: number; quente: number }> = {}
  const campos: Array<[keyof Exercicio, boolean]> = [
    ['chefe', true], ['auxiliar', true], ['seguranca', true], ['condicoes', false],
    ['monitor1', false], ['monitor2', false], ['monitor3', false],
  ]
  for (const ex of state.exercicios) {
    for (const [campo, quente] of campos) {
      const id = ex[campo] as string | null
      if (!id) continue
      if (!carga[id]) carga[id] = { total: 0, quente: 0 }
      carga[id].total++
      if (quente) carga[id].quente++
    }
  }

  const distribuicaoCarga = Object.entries(carga)
    .map(([id, v]) => ({ nome: usuariosNome(id), total: v.total, quente: v.quente }))
    .sort((a, b) => b.total - a.total)

  return {
    totalExercicios: state.exercicios.length,
    conflitos, alertas, incompletos, ok,
    solicitacoesPendentes, permutasAbertas,
    distribuicaoCarga,
  }
}
