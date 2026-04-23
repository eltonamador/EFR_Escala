import { useRef } from 'react'

type Tela = 'escala' | 'solicitacoes' | 'coordenacao'

interface Props {
  tela: Tela
  onChange: (t: Tela) => void
  onExport: () => void
  onImport: (file: File) => void
  onReset: () => void
}

const items: { id: Tela; label: string }[] = [
  { id: 'escala', label: 'Escala Geral' },
  { id: 'solicitacoes', label: 'Solicitações e Permutas' },
  { id: 'coordenacao', label: 'Painel da Coordenação' },
]

export function NavBar({ tela, onChange, onExport, onImport, onReset }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) { onImport(file); e.target.value = '' }
  }

  const tabs = items.map(item => (
    <button
      key={item.id}
      className="nav-tab-btn"
      data-active={String(tela === item.id)}
      onClick={() => onChange(item.id)}
    >{item.label}</button>
  ))

  return (
    <nav className="nav-root">
      {/* Row 1: brand + (desktop: tabs) + actions */}
      <div className="nav-row1">
        <span className="nav-brand" style={{
          color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
          display: 'flex', alignItems: 'center', letterSpacing: '-0.01em', whiteSpace: 'nowrap',
        }}>EFR Escala</span>

        {/* Tabs visíveis só no desktop (dentro de row1) */}
        <div className="nav-tabs-desktop">{tabs}</div>

        <div className="nav-actions">
          <button onClick={onExport} style={navBtn} title="Exportar estado para JSON">Exportar</button>
          <button onClick={() => fileRef.current?.click()} style={navBtn} title="Importar estado de JSON">Importar</button>
          <button
            onClick={() => { if (confirm('Resetar para o estado inicial? Os dados atuais serão perdidos.')) onReset() }}
            style={{ ...navBtn, color: 'rgba(255,180,180,0.9)' }}
            title="Resetar para dados iniciais"
          >Reset</button>
          <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>

      {/* Row 2: tabs com scroll — visível só no mobile */}
      <div className="nav-row2">{tabs}</div>
    </nav>
  )
}

const navBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 'var(--radius)', color: 'rgba(255,255,255,0.85)',
  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.04em', textTransform: 'uppercase',
  padding: '5px 12px', cursor: 'pointer',
}

export type { Tela }
