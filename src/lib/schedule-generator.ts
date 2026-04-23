import type { Exercicio } from '../types/domain.types'

// Pools ordered to optimize distribution and minimize adjacent-day alerts.
// Chefe: alternates two groups of 3 across days.
// Aux: Sgts first (free chefe-habilitados for chefe role), officers as backup.
// Segurança/Condições: starts with Sgts then SDs.
// Monitor: all SDs + Sgt Eline.
const POOL = {
  chefe:     ['u01','u03','u05','u02','u04','u06'],
  auxiliar:  ['u08','u09','u10','u01','u02','u03','u04','u05'],
  seguranca: ['u07','u11','u12','u08','u09','u10','u13','u14','u15','u16','u17','u18','u19','u20'],
  condicoes: ['u11','u08','u09','u10','u13','u14','u15','u16','u17','u18','u19','u20','u21','u22','u23'],
  monitor:   ['u11','u13','u14','u15','u16','u17','u18','u19','u20','u21','u22','u23'],
}

type Role = keyof typeof POOL

const DATAS = [
  '2026-05-04','2026-05-05','2026-05-06','2026-05-07','2026-05-08',
  '2026-05-11','2026-05-12','2026-05-13','2026-05-14','2026-05-15',
]

export function gerarEscalaInicial(): Exercicio[] {
  // Rotation position per role — advances after each pick so next exercise
  // starts where we left off, distributing load across the schedule.
  const pos: Record<Role, number> = { chefe: 0, auxiliar: 0, seguranca: 0, condicoes: 0, monitor: 0 }

  function next(role: Role, exclude: Set<string>): string {
    const pool = POOL[role]
    for (let i = 0; i < pool.length; i++) {
      const idx = (pos[role] + i) % pool.length
      if (!exclude.has(pool[idx])) {
        pos[role] = (idx + 1) % pool.length
        return pool[idx]
      }
    }
    return pool.find(u => !exclude.has(u)) ?? pool[0]
  }

  const exercicios: Exercicio[] = []

  for (const data of DATAS) {
    for (const numero of [1, 2] as (1 | 2)[]) {
      const used = new Set<string>()

      const chefe    = next('chefe',     used); used.add(chefe)
      const auxiliar = next('auxiliar',  used); used.add(auxiliar)
      const seguranca = next('seguranca', used); used.add(seguranca)
      const condicoes = next('condicoes', used); used.add(condicoes)
      const monitor1  = next('monitor',   used); used.add(monitor1)
      const monitor2  = next('monitor',   used); used.add(monitor2)

      exercicios.push({
        id: `ex-${data}-${numero}`,
        data, numero,
        chefe, auxiliar, seguranca, condicoes,
        monitor1, monitor2, monitor3: null,
        status: 'OK',
      })
    }
  }

  return exercicios
}
