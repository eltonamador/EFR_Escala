import type { Exercicio, StatusExercicio } from '../types/domain.types'
import {
  verificarBloqueios,
  verificarAlertas,
  camposObrigatoriosPreenchidos,
} from './validation-rules'

export interface ExercicioComStatus extends Exercicio {
  status: StatusExercicio
}

export function calcularStatus(ex: Exercicio, todosExercicios: Exercicio[]): StatusExercicio {
  if (verificarBloqueios(ex, todosExercicios).length > 0) return 'CONFLITO'
  if (!camposObrigatoriosPreenchidos(ex)) return 'INCOMPLETO'
  if (verificarAlertas(ex, todosExercicios).length > 0) return 'ALERTA'
  return 'OK'
}

export function calcularStatusTodos(exercicios: Exercicio[]): ExercicioComStatus[] {
  return exercicios.map(ex => ({
    ...ex,
    status: calcularStatus(ex, exercicios),
  }))
}
