import type { AppState, Exercicio, Solicitacao, StatusSolicitacao } from '../types/domain.types'
import type { IRepository } from './repository'
import { supabase } from '../lib/supabaseClient'
import { MOCK_STATE } from './mockState'

// Linha do banco → Exercicio do domínio
function rowToExercicio(row: Record<string, unknown>): Exercicio {
  return {
    id:        row['id']           as string,
    data:      row['data']         as string,
    numero:    row['numero']       as 1 | 2,
    chefe:     (row['chefe_id']    as string | null) ?? null,
    auxiliar:  (row['auxiliar_id'] as string | null) ?? null,
    seguranca: (row['seguranca_id']as string | null) ?? null,
    condicoes: (row['condicoes_id']as string | null) ?? null,
    monitor1:  (row['monitor1_id'] as string | null) ?? null,
    monitor2:  (row['monitor2_id'] as string | null) ?? null,
    monitor3:  (row['monitor3_id'] as string | null) ?? null,
    status: 'OK', // recalculado em runtime
  }
}

// Linha do banco → Solicitacao do domínio
function rowToSolicitacao(row: Record<string, unknown>): Solicitacao {
  return {
    id:                    row['id']                      as string,
    solicitanteId:         row['solicitante_id']          as string,
    data:                  row['data']                    as string,
    exercicioNumero:       row['exercicio_numero']        as 1 | 2,
    funcao:                row['funcao']                  as Solicitacao['funcao'],
    tipo:                  row['tipo']                    as Solicitacao['tipo'],
    justificativa:         row['justificativa']           as string,
    substitutoSugeridoId:  (row['substituto_sugerido_id']  as string | null) ?? null,
    exercicioPermutaId:    (row['exercicio_permuta_id']    as string | null) ?? null,
    funcaoPermuta:         (row['funcao_permuta']          as Solicitacao['funcaoPermuta']) ?? null,
    interessadoId:         (row['interessado_id']          as string | null) ?? null,
    observacaoCoordenacao: (row['observacao_coordenacao'] as string | null) ?? null,
    status:                row['status']                  as Solicitacao['status'],
    criadoEm:              row['criado_em']               as string,
  }
}

export const supabaseRepo: IRepository = {
  hydrate(): AppState {
    // Supabase é async — retorna estado vazio; App.tsx deve chamar hydrateAsync() via useEffect.
    // Esta assinatura síncrona existe para compatibilidade com a interface atual.
    // Fase 3 transforma App.tsx para async e remove este fallback.
    return structuredClone(MOCK_STATE)
  },

  saveExercicio(ex: Exercicio, state: AppState): AppState {
    const next: AppState = {
      ...state,
      exercicios: state.exercicios.map(e => e.id === ex.id ? ex : e),
    }
    supabase.from('exercicios').update({
      chefe_id:     ex.chefe,
      auxiliar_id:  ex.auxiliar,
      seguranca_id: ex.seguranca,
      condicoes_id: ex.condicoes,
      monitor1_id:  ex.monitor1,
      monitor2_id:  ex.monitor2,
      monitor3_id:  ex.monitor3,
    }).eq('id', ex.id)
      .then(({ error }) => { if (error) console.error('supabase saveExercicio', error) })
    return next
  },

  appendSolicitacao(sol: Solicitacao, state: AppState): AppState {
    const next: AppState = { ...state, solicitacoes: [...state.solicitacoes, sol] }
    supabase.from('solicitacoes').insert({
      id:                     sol.id,
      solicitante_id:         sol.solicitanteId,
      data:                   sol.data,
      exercicio_numero:       sol.exercicioNumero,
      funcao:                 sol.funcao,
      tipo:                   sol.tipo,
      justificativa:          sol.justificativa,
      substituto_sugerido_id: sol.substitutoSugeridoId,
      exercicio_permuta_id:   sol.exercicioPermutaId,
      funcao_permuta:         sol.funcaoPermuta,
      interessado_id:         sol.interessadoId,
      observacao_coordenacao: sol.observacaoCoordenacao,
      status:                 sol.status,
      criado_em:              sol.criadoEm,
    }).then(({ error }) => { if (error) console.error('supabase appendSolicitacao', error) })
    return next
  },

  updateSolicitacao(updated: Solicitacao, state: AppState): AppState {
    const next: AppState = {
      ...state,
      solicitacoes: state.solicitacoes.map(s => s.id === updated.id ? updated : s),
    }
    supabase.from('solicitacoes').update({
      status:                 updated.status,
      interessado_id:         updated.interessadoId,
      observacao_coordenacao: updated.observacaoCoordenacao,
    }).eq('id', updated.id)
      .then(({ error }) => { if (error) console.error('supabase updateSolicitacao', error) })
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
    supabase.from('solicitacoes').update({
      status,
      ...(obs !== null ? { observacao_coordenacao: obs } : {}),
    }).eq('id', id)
      .then(({ error }) => { if (error) console.error('supabase updateSolicitacaoStatus', error) })
    return next
  },

  persistState(_state: AppState): void {
    // No-op: Supabase é atualizado por operação granular acima.
    // Mantido na interface para compatibilidade com App.tsx.
  },

  reset(): AppState {
    // Reset completo requer delete nas tabelas — operação administrativa manual.
    console.warn('reset() não suportado no modo Supabase. Use o painel do Supabase.')
    return structuredClone(MOCK_STATE)
  },
}

// Carga assíncrona completa — chamar via useEffect em App.tsx
export async function hydrateFromSupabase(): Promise<AppState> {
  const [exResult, solResult] = await Promise.all([
    supabase.from('exercicios').select('*').order('data').order('numero'),
    supabase.from('solicitacoes').select('*').order('criado_em'),
  ])

  if (exResult.error) {
    console.error('[Supabase] exercicios error:', JSON.stringify(exResult.error))
    throw new Error(exResult.error.message)
  }
  if (solResult.error) {
    console.error('[Supabase] solicitacoes error:', JSON.stringify(solResult.error))
    throw new Error(solResult.error.message)
  }

  console.log('[Supabase] exercicios carregados:', exResult.data?.length ?? 0)
  return {
    version:      MOCK_STATE.version,
    exercicios:   (exResult.data  ?? []).map(r => rowToExercicio(r  as Record<string, unknown>)),
    solicitacoes: (solResult.data ?? []).map(r => rowToSolicitacao(r as Record<string, unknown>)),
  }
}
