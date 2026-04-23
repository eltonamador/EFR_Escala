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

  return (
    <nav style={{
      background: 'var(--color-primary)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'stretch',
      height: 52,
    }}>
      <span style={{
        color: '#fff', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
        display: 'flex', alignItems: 'center', marginRight: 32, letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}>EFR Escala</span>

      <div style={{ display: 'flex', flex: 1 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onChange(item.id)} style={{
            background: 'none', border: 'none',
            borderBottom: tela === item.id ? '2px solid #bec6e0' : '2px solid transparent',
            color: tela === item.id ? '#fff' : 'rgba(255,255,255,0.6)',
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13,
            padding: '0 16px', height: '100%', cursor: 'pointer',
            transition: 'color 0.15s', whiteSpace: 'nowrap',
          }}>{item.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onExport} style={navBtn} title="Exportar estado para JSON">Exportar</button>
        <button onClick={() => fileRef.current?.click()} style={navBtn} title="Importar estado de JSON">Importar</button>
        <button
          onClick={() => { if (confirm('Resetar para o estado inicial? Os dados atuais serão perdidos.')) onReset() }}
          style={{ ...navBtn, color: 'rgba(255,180,180,0.9)' }}
          title="Resetar para dados iniciais"
        >Reset</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFile} />
      </div>
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
