export type Funcao = 'chefe' | 'auxiliar' | 'seguranca' | 'condicoes' | 'monitor1' | 'monitor2' | 'monitor3'

export type StatusExercicio = 'OK' | 'ALERTA' | 'CONFLITO' | 'INCOMPLETO'

export type StatusSolicitacao = 'PENDENTE' | 'ABERTA_PERMUTA' | 'ASSUMIDA' | 'APROVADA' | 'REJEITADA' | 'CANCELADA'

export type TipoSolicitacao = 'SUBSTITUICAO' | 'PERMUTA'

export interface Usuario {
  id: string
  nome: string
  patente: string
  habilitacoes: Funcao[]
}

export interface Exercicio {
  id: string
  data: string
  numero: 1 | 2
  chefe: string | null
  auxiliar: string | null
  seguranca: string | null
  condicoes: string | null
  monitor1: string | null
  monitor2: string | null
  monitor3: string | null
  status: StatusExercicio
}

export interface Solicitacao {
  id: string
  solicitanteId: string
  data: string
  exercicioNumero: 1 | 2
  funcao: Funcao
  tipo: TipoSolicitacao
  justificativa: string
  substitutoSugeridoId: string | null
  exercicioPermutaId: string | null
  funcaoPermuta: Funcao | null
  interessadoId: string | null
  observacaoCoordenacao: string | null
  status: StatusSolicitacao
  criadoEm: string
}

export interface AppState {
  version: number
  exercicios: Exercicio[]
  solicitacoes: Solicitacao[]
}
