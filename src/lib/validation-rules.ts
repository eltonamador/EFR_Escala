import type { Exercicio, Funcao } from '../types/domain.types'
import { getUsuarioById } from '../data/usuarios'

export const FUNCOES_OBRIGATORIAS: Funcao[] = ['chefe', 'auxiliar', 'seguranca', 'condicoes']
export const FUNCOES_QUENTES: Funcao[] = ['chefe', 'auxiliar', 'seguranca']

export interface Bloqueio {
  tipo: 'DUPLICIDADE_EXERCICIO' | 'EXCESSO_DIA' | 'SEM_HABILITACAO' | 'DIA_ADJACENTE'
  descricao: string
}

export interface AlertaForte {
  tipo: 'CARGA_EXCESSIVA' | 'REPETICAO_QUENTE'
  descricao: string
}

function getAlocados(ex: Exercicio): Array<{ usuarioId: string; funcao: Funcao }> {
  const campos: Array<[string | null, Funcao]> = [
    [ex.chefe, 'chefe'], [ex.auxiliar, 'auxiliar'], [ex.seguranca, 'seguranca'],
    [ex.condicoes, 'condicoes'], [ex.monitor1, 'monitor1'],
    [ex.monitor2, 'monitor2'], [ex.monitor3, 'monitor3'],
  ]
  return campos.filter(([id]) => id !== null).map(([id, f]) => ({ usuarioId: id!, funcao: f }))
}

const FUNCAO_LABEL: Record<string, string> = {
  chefe: 'Chefe', auxiliar: 'Auxiliar', seguranca: 'Segurança',
}

export function verificarBloqueios(ex: Exercicio, todosExercicios: Exercicio[]): Bloqueio[] {
  const bloqueios: Bloqueio[] = []
  const alocados = getAlocados(ex)

  // mesma pessoa em duas funções no mesmo exercício
  const idsSeen = new Set<string>()
  for (const { usuarioId } of alocados) {
    if (idsSeen.has(usuarioId)) {
      const nome = getUsuarioById(usuarioId)?.nome ?? usuarioId
      bloqueios.push({ tipo: 'DUPLICIDADE_EXERCICIO', descricao: `${nome} está em duas funções neste exercício` })
    }
    idsSeen.add(usuarioId)
  }

  // chefe/auxiliar/segurança não excedem 2 exercícios no dia
  const doMesmoDia = todosExercicios.filter(e => e.data === ex.data && e.id !== ex.id)
  for (const funcao of FUNCOES_QUENTES) {
    const idAtual = ex[funcao as keyof Exercicio] as string | null
    if (!idAtual) continue
    const countNoDia = doMesmoDia.filter(e => (e[funcao as keyof Exercicio] as string | null) === idAtual).length
    if (countNoDia >= 2) {
      const nome = getUsuarioById(idAtual)?.nome ?? idAtual
      bloqueios.push({ tipo: 'EXCESSO_DIA', descricao: `${nome} já atua 2x neste dia como ${FUNCAO_LABEL[funcao] ?? funcao}` })
    }
  }

  // habilitação
  for (const { usuarioId, funcao } of alocados) {
    const usuario = getUsuarioById(usuarioId)
    if (usuario && !usuario.habilitacoes.includes(funcao)) {
      bloqueios.push({ tipo: 'SEM_HABILITACAO', descricao: `${usuario.nome} não está habilitado para ${FUNCAO_LABEL[funcao] ?? funcao}` })
    }
  }

  // dia adjacente em função quente — BLOQUEANTE
  const dataAtual = new Date(ex.data + 'T00:00:00')
  const anterior = new Date(dataAtual); anterior.setDate(dataAtual.getDate() - 1)
  const posterior = new Date(dataAtual); posterior.setDate(dataAtual.getDate() + 1)
  const toISO = (d: Date) => d.toISOString().slice(0, 10)

  const adjacentes = todosExercicios.filter(e =>
    e.id !== ex.id && (e.data === toISO(anterior) || e.data === toISO(posterior))
  )

  for (const funcao of FUNCOES_QUENTES) {
    const idAtual = ex[funcao as keyof Exercicio] as string | null
    if (!idAtual) continue
    const exAdj = adjacentes.find(e => (e[funcao as keyof Exercicio] as string | null) === idAtual)
    if (exAdj) {
      const nome = getUsuarioById(idAtual)?.nome ?? idAtual
      const qual = exAdj.data < ex.data ? 'dia anterior' : 'dia seguinte'
      bloqueios.push({
        tipo: 'DIA_ADJACENTE',
        descricao: `${nome} já atua como ${FUNCAO_LABEL[funcao] ?? funcao} no ${qual} (${exAdj.data.split('-').reverse().join('/')})`,
      })
    }
  }

  return bloqueios
}

export function verificarAlertas(ex: Exercicio, todosExercicios: Exercicio[]): AlertaForte[] {
  const alertas: AlertaForte[] = []

  const dataAtual = new Date(ex.data + 'T00:00:00')
  const semanaInicio = new Date(dataAtual); semanaInicio.setDate(dataAtual.getDate() - 3)
  const semanaFim = new Date(dataAtual); semanaFim.setDate(dataAtual.getDate() + 3)
  const naSemana = todosExercicios.filter(e => {
    const d = new Date(e.data + 'T00:00:00')
    return d >= semanaInicio && d <= semanaFim
  })

  // carga excessiva: mesmo usuário em mais de 3 exercícios na janela
  const contagem: Record<string, number> = {}
  for (const e of naSemana) {
    for (const { usuarioId } of getAlocados(e)) {
      contagem[usuarioId] = (contagem[usuarioId] ?? 0) + 1
    }
  }
  for (const [uid, count] of Object.entries(contagem)) {
    if (count > 3) {
      const nome = getUsuarioById(uid)?.nome ?? uid
      alertas.push({ tipo: 'CARGA_EXCESSIVA', descricao: `${nome} com ${count} exercícios na semana` })
    }
  }

  // repetição excessiva em funções quentes: >2 vezes no intervalo
  const repeticao: Record<string, number> = {}
  for (const e of naSemana) {
    for (const funcao of FUNCOES_QUENTES) {
      const id = e[funcao as keyof Exercicio] as string | null
      if (id) repeticao[id] = (repeticao[id] ?? 0) + 1
    }
  }
  for (const [uid, count] of Object.entries(repeticao)) {
    if (count > 2) {
      const nome = getUsuarioById(uid)?.nome ?? uid
      alertas.push({ tipo: 'REPETICAO_QUENTE', descricao: `${nome} em função quente ${count}x na semana` })
    }
  }

  return alertas
}

export function camposObrigatoriosPreenchidos(ex: Exercicio): boolean {
  return FUNCOES_OBRIGATORIAS.every(f => (ex[f as keyof Exercicio] as string | null) !== null)
}
