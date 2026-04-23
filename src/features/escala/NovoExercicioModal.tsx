import { useState } from 'react'
import type { AppState, Exercicio, Funcao } from '../../types/domain.types'
import { USUARIOS } from '../../data/usuarios'
import { Modal } from '../../components/Modal'
import { FormField, Select } from '../../components/FormField'
import { verificarBloqueios, verificarAlertas } from '../../lib/validation-rules'
import { calcularStatus } from '../../lib/status-calculation'
import { StatusBadge } from '../../components/StatusBadge'

interface Props {
  state: AppState
  onSave: (ex: Exercicio) => void
  onClose: () => void
}

type CampoFuncao = Extract<keyof Exercicio, 'chefe' | 'auxiliar' | 'seguranca' | 'condicoes' | 'monitor1' | 'monitor2' | 'monitor3'>

const CAMPOS: Array<{ campo: CampoFuncao; label: string; obrigatorio: boolean; funcao: Funcao }> = [
  { campo: 'chefe',     label: 'Chefe',     obrigatorio: true,  funcao: 'chefe' },
  { campo: 'auxiliar',  label: 'Auxiliar',  obrigatorio: true,  funcao: 'auxiliar' },
  { campo: 'seguranca', label: 'Segurança', obrigatorio: true,  funcao: 'seguranca' },
  { campo: 'condicoes', label: 'Condições', obrigatorio: true,  funcao: 'condicoes' },
  { campo: 'monitor1',  label: 'Monitor 1', obrigatorio: false, funcao: 'monitor1' },
  { campo: 'monitor2',  label: 'Monitor 2', obrigatorio: false, funcao: 'monitor2' },
  { campo: 'monitor3',  label: 'Monitor 3', obrigatorio: false, funcao: 'monitor3' },
]

const EMPTY: Omit<Exercicio, 'id' | 'status'> = {
  data: '', numero: 1,
  chefe: null, auxiliar: null, seguranca: null, condicoes: null,
  monitor1: null, monitor2: null, monitor3: null,
}

export function NovoExercicioModal({ state, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Omit<Exercicio, 'id' | 'status'>>(EMPTY)

  const tempEx: Exercicio = { ...draft, id: '__novo__', status: 'OK' }
  const bloqueios = verificarBloqueios(tempEx, state.exercicios)
  const alertas = verificarAlertas(tempEx, state.exercicios)
  const statusCalc = calcularStatus(tempEx, state.exercicios)

  const dataValida = draft.data !== ''
  const podeSalvar = dataValida && bloqueios.length === 0

  // impede criar 3º exercício no mesmo dia
  const exerciciosNoDia = state.exercicios.filter(
    e => e.data === draft.data && e.numero === draft.numero
  )
  const duplicataDiaTurno = exerciciosNoDia.length > 0

  function set(campo: CampoFuncao, value: string) {
    setDraft(d => ({ ...d, [campo]: value === '' ? null : value }))
  }

  function handleSave() {
    if (!podeSalvar || duplicataDiaTurno) return
    const novo: Exercicio = {
      ...tempEx,
      id: `ex-${draft.data}-${draft.numero}-${Date.now()}`,
    }
    onSave(novo)
  }

  function usuariosHabilitados(funcao: Funcao) {
    return USUARIOS.filter(u => u.habilitacoes.includes(funcao))
  }

  return (
    <Modal titulo="Novo Exercício" onClose={onClose} largura={520}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <FormField label="Data *">
          <input
            type="date" value={draft.data}
            onChange={e => setDraft(d => ({ ...d, data: e.target.value }))}
            style={{
              width: '100%', padding: '7px 10px', fontSize: 13,
              border: '1px solid var(--color-border-variant)', borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-body)', color: 'var(--color-on-surface)',
            }}
          />
        </FormField>
        <FormField label="Exercício *">
          <Select value={String(draft.numero)} onChange={v => setDraft(d => ({ ...d, numero: Number(v) as 1 | 2 }))}>
            <option value="1">1º</option>
            <option value="2">2º</option>
          </Select>
        </FormField>
      </div>

      {duplicataDiaTurno && draft.data && (
        <div style={{
          background: 'var(--color-conflito-bg)', color: 'var(--color-conflito-text)',
          borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12, marginBottom: 8,
        }}>⛔ Já existe um {draft.numero}º exercício em {draft.data.split('-').reverse().join('/')}.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        {CAMPOS.map(({ campo, label, obrigatorio, funcao }) => (
          <FormField key={campo} label={`${label}${obrigatorio ? ' *' : ''}`}>
            <Select value={draft[campo] ?? ''} onChange={v => set(campo, v)}>
              {!obrigatorio && <option value="">—</option>}
              {obrigatorio && <option value="" disabled>Selecione</option>}
              {usuariosHabilitados(funcao).map(u => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </Select>
          </FormField>
        ))}
      </div>

      {(bloqueios.length > 0 || alertas.length > 0) && (
        <div style={{ marginTop: 8 }}>
          {bloqueios.map((b, i) => (
            <div key={i} style={{ background: 'var(--color-conflito-bg)', color: 'var(--color-conflito-text)', borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12, marginBottom: 4 }}>
              ⛔ {b.descricao}
            </div>
          ))}
          {alertas.map((a, i) => (
            <div key={i} style={{ background: 'var(--color-alerta-bg)', color: 'var(--color-alerta-text)', borderRadius: 'var(--radius)', padding: '6px 10px', fontSize: 12, marginBottom: 4 }}>
              ⚠ {a.descricao}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <StatusBadge status={statusCalc} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={btnSecondary}>Cancelar</button>
          <button
            onClick={handleSave}
            disabled={!podeSalvar || duplicataDiaTurno}
            style={{
              ...btnPrimary,
              opacity: (podeSalvar && !duplicataDiaTurno) ? 1 : 0.4,
              cursor: (podeSalvar && !duplicataDiaTurno) ? 'pointer' : 'not-allowed',
            }}
          >Criar</button>
        </div>
      </div>
    </Modal>
  )
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--color-primary)', color: '#fff', border: 'none',
  borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
  fontFamily: 'var(--font-ui)', fontWeight: 600,
}
const btnSecondary: React.CSSProperties = {
  background: 'none', color: 'var(--color-secondary)',
  border: '1px solid var(--color-border-variant)',
  borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: 13,
  fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
}
