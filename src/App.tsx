import { useState, useEffect, useCallback } from 'react'
import { NavBar, type Tela } from './components/NavBar'
import { EscalaGeral } from './features/escala/EscalaGeral'
import { SolicitacoesList } from './features/solicitacoes/SolicitacoesList'
import { PainelCoordenacao } from './features/coordenacao/PainelCoordenacao'
import { exportJSON, validateImport } from './lib/storage'
import { initRepo, getRepo } from './data/repository'
import { localStorageRepo } from './data/localStorageRepo'
import { supabaseRepo, hydrateFromSupabase } from './data/supabaseRepo'
import { Toast, type ToastMsg } from './components/Toast'
import type { AppState } from './types/domain.types'

const dataSource = (import.meta.env as Record<string, string>)['VITE_DATA_SOURCE'] ?? 'localStorage'
initRepo(dataSource === 'supabase' ? supabaseRepo : localStorageRepo)

export default function App() {
  const [tela, setTela] = useState<Tela>('escala')
  const [state, setStateRaw] = useState<AppState>(() => getRepo().hydrate())
  const [toast, setToast] = useState<ToastMsg | null>(null)

  // Carga assíncrona do Supabase no mount
  useEffect(() => {
    if (dataSource !== 'supabase') return
    hydrateFromSupabase()
      .then(loaded => setStateRaw(loaded))
      .catch(err => {
        console.error('[App] falha ao carregar Supabase:', err)
        setToast({ tipo: 'erro', texto: `Supabase: ${err.message}` })
      })
  }, [])

  function setState(next: AppState) {
    setStateRaw(next)
    getRepo().persistState(next)
  }

  function handleExport() {
    exportJSON(state)
    setToast({ tipo: 'sucesso', texto: 'Arquivo JSON exportado com sucesso.' })
  }

  function handleImport(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target?.result as string)
        const result = validateImport(parsed)
        if (!result.ok) { setToast({ tipo: 'erro', texto: result.erro }); return }
        setState(result.state)
        setToast({ tipo: 'sucesso', texto: 'Estado importado com sucesso.' })
      } catch {
        setToast({ tipo: 'erro', texto: 'Arquivo inválido ou corrompido.' })
      }
    }
    reader.readAsText(file)
  }

  function handleReset() {
    const fresh = getRepo().reset()
    setStateRaw(fresh)
    setToast({ tipo: 'sucesso', texto: 'Estado resetado para os dados iniciais.' })
  }

  const dismissToast = useCallback(() => setToast(null), [])

  const isLocal = dataSource === 'localStorage'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <NavBar
        tela={tela} onChange={setTela}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        isLocal={isLocal}
      />
      <main style={{ maxWidth: 1440, margin: '0 auto' }}>
        {tela === 'escala'       && <EscalaGeral state={state} setState={setState} />}
        {tela === 'solicitacoes' && <SolicitacoesList state={state} setState={setState} />}
        {tela === 'coordenacao'  && <PainelCoordenacao state={state} />}
      </main>
      <Toast msg={toast} onDismiss={dismissToast} />
    </div>
  )
}
