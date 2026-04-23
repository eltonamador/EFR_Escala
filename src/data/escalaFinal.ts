import type { Exercicio } from '../types/domain.types'

// Fonte: data/escala_final_maio_2026_v3.xlsx — Sheet "Escala Final"
// Período: 04/05/2026 a 15/05/2026 | 20 exercícios | sem Monitor 3
export function getEscalaFinal(): Exercicio[] {
  return [
    // --- 04/05/2026 ---
    { id: 'ex-0504-1', data: '2026-05-04', numero: 1, status: 'OK',
      chefe: 'u01', auxiliar: 'u03', seguranca: 'u08', condicoes: 'u19',
      monitor1: 'u23', monitor2: 'u16', monitor3: null },
    { id: 'ex-0504-2', data: '2026-05-04', numero: 2, status: 'OK',
      chefe: 'u05', auxiliar: 'u10', seguranca: 'u09', condicoes: 'u12',
      monitor1: 'u13', monitor2: 'u14', monitor3: null },

    // --- 05/05/2026 ---
    { id: 'ex-0505-1', data: '2026-05-05', numero: 1, status: 'OK',
      chefe: 'u02', auxiliar: 'u04', seguranca: 'u15', condicoes: 'u17',
      monitor1: 'u18', monitor2: 'u20', monitor3: null },
    { id: 'ex-0505-2', data: '2026-05-05', numero: 2, status: 'OK',
      chefe: 'u06', auxiliar: 'u09', seguranca: 'u16', condicoes: 'u19',
      monitor1: 'u21', monitor2: 'u22', monitor3: null },

    // --- 06/05/2026 ---
    { id: 'ex-0506-1', data: '2026-05-06', numero: 1, status: 'OK',
      chefe: 'u03', auxiliar: 'u05', seguranca: 'u23', condicoes: 'u08',
      monitor1: 'u21', monitor2: 'u22', monitor3: null },
    { id: 'ex-0506-2', data: '2026-05-06', numero: 2, status: 'OK',
      chefe: 'u01', auxiliar: 'u03', seguranca: 'u10', condicoes: 'u11',
      monitor1: 'u20', monitor2: 'u13', monitor3: null },

    // --- 07/05/2026 ---
    { id: 'ex-0507-1', data: '2026-05-07', numero: 1, status: 'OK',
      chefe: 'u04', auxiliar: 'u08', seguranca: 'u14', condicoes: 'u15',
      monitor1: 'u16', monitor2: 'u18', monitor3: null },
    { id: 'ex-0507-2', data: '2026-05-07', numero: 2, status: 'OK',
      chefe: 'u02', auxiliar: 'u04', seguranca: 'u17', condicoes: 'u20',
      monitor1: 'u19', monitor2: 'u21', monitor3: null },

    // --- 08/05/2026 ---
    { id: 'ex-0508-1', data: '2026-05-08', numero: 1, status: 'OK',
      chefe: 'u05', auxiliar: 'u01', seguranca: 'u22', condicoes: 'u23',
      monitor1: 'u18', monitor2: 'u19', monitor3: null },
    { id: 'ex-0508-2', data: '2026-05-08', numero: 2, status: 'OK',
      chefe: 'u03', auxiliar: 'u09', seguranca: 'u07', condicoes: 'u10',
      monitor1: 'u14', monitor2: 'u19', monitor3: null },

    // --- 11/05/2026 ---
    { id: 'ex-1105-1', data: '2026-05-11', numero: 1, status: 'OK',
      chefe: 'u06', auxiliar: 'u02', seguranca: 'u13', condicoes: 'u14',
      monitor1: 'u15', monitor2: 'u16', monitor3: null },
    { id: 'ex-1105-2', data: '2026-05-11', numero: 2, status: 'OK',
      chefe: 'u04', auxiliar: 'u09', seguranca: 'u18', condicoes: 'u17',
      monitor1: 'u20', monitor2: 'u19', monitor3: null },

    // --- 12/05/2026 ---
    { id: 'ex-1205-1', data: '2026-05-12', numero: 1, status: 'OK',
      chefe: 'u01', auxiliar: 'u10', seguranca: 'u07', condicoes: 'u22',
      monitor1: 'u23', monitor2: 'u15', monitor3: null },
    { id: 'ex-1205-2', data: '2026-05-12', numero: 2, status: 'OK',
      chefe: 'u03', auxiliar: 'u08', seguranca: 'u11', condicoes: 'u09',
      monitor1: 'u14', monitor2: 'u13', monitor3: null },

    // --- 13/05/2026 ---
    { id: 'ex-1305-1', data: '2026-05-13', numero: 1, status: 'OK',
      chefe: 'u02', auxiliar: 'u06', seguranca: 'u12', condicoes: 'u13',
      monitor1: 'u14', monitor2: 'u15', monitor3: null },
    { id: 'ex-1305-2', data: '2026-05-13', numero: 2, status: 'OK',
      chefe: 'u04', auxiliar: 'u09', seguranca: 'u20', condicoes: 'u16',
      monitor1: 'u17', monitor2: 'u18', monitor3: null },

    // --- 14/05/2026 ---
    { id: 'ex-1405-1', data: '2026-05-14', numero: 1, status: 'OK',
      chefe: 'u03', auxiliar: 'u01', seguranca: 'u19', condicoes: 'u22',
      monitor1: 'u23', monitor2: 'u16', monitor3: null },
    { id: 'ex-1405-2', data: '2026-05-14', numero: 2, status: 'OK',
      chefe: 'u05', auxiliar: 'u10', seguranca: 'u21', condicoes: 'u09',
      monitor1: 'u14', monitor2: 'u13', monitor3: null },

    // --- 15/05/2026 ---
    { id: 'ex-1505-1', data: '2026-05-15', numero: 1, status: 'OK',
      chefe: 'u02', auxiliar: 'u08', seguranca: 'u11', condicoes: 'u13',
      monitor1: 'u14', monitor2: 'u15', monitor3: null },
    { id: 'ex-1505-2', data: '2026-05-15', numero: 2, status: 'OK',
      chefe: 'u06', auxiliar: 'u04', seguranca: 'u12', condicoes: 'u16',
      monitor1: 'u17', monitor2: 'u18', monitor3: null },
  ]
}
