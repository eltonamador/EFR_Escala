import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { erro: string | null }
> {
  state = { erro: null }
  static getDerivedStateFromError(e: unknown) {
    return { erro: e instanceof Error ? e.message : String(e) }
  }
  render() {
    if (this.state.erro) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', color: '#b91c1c' }}>
          <strong>Erro ao inicializar o aplicativo:</strong>
          <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{this.state.erro}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
