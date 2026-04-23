import type { Usuario } from '../types/domain.types'

// Fonte: data/Instrutores.xlsx — Planilha1
export const USUARIOS: Usuario[] = [
  { id: 'u01', nome: 'Cel Ivanete',       patente: 'Cel', habilitacoes: ['chefe', 'auxiliar'] },
  { id: 'u02', nome: 'Maj Chucre',        patente: 'Maj', habilitacoes: ['chefe', 'auxiliar'] },
  { id: 'u03', nome: 'Cap Amador',        patente: 'Cap', habilitacoes: ['chefe', 'auxiliar'] },
  { id: 'u04', nome: 'Cap Charlys',       patente: 'Cap', habilitacoes: ['chefe', 'auxiliar'] },
  { id: 'u05', nome: 'Cap Jorge Luiz',    patente: 'Cap', habilitacoes: ['chefe', 'auxiliar'] },
  { id: 'u06', nome: 'Ten Cecília',        patente: 'Ten', habilitacoes: ['chefe', 'auxiliar'] },
  { id: 'u07', nome: 'Cap Caio',          patente: 'Cap', habilitacoes: ['seguranca'] },
  { id: 'u08', nome: 'Sgt Cristiano',     patente: 'Sgt', habilitacoes: ['auxiliar', 'seguranca', 'condicoes'] },
  { id: 'u09', nome: 'Sgt Santiago',      patente: 'Sgt', habilitacoes: ['auxiliar', 'seguranca', 'condicoes'] },
  { id: 'u10', nome: 'Sgt Fernando',      patente: 'Sgt', habilitacoes: ['auxiliar', 'seguranca', 'condicoes'] },
  { id: 'u11', nome: 'Sgt Eline',         patente: 'Sgt', habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u12', nome: 'Sgt S. Souza',      patente: 'Sgt', habilitacoes: ['seguranca', 'condicoes'] },
  { id: 'u13', nome: 'SD Elâine',          patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u14', nome: 'SD Jaffer',         patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u15', nome: 'SD R. dos Santos',  patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u16', nome: 'SD Raíssa',         patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u17', nome: 'SD Thales',         patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u18', nome: 'SD Jorge Lucas',    patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u19', nome: 'SD Carlos Monteiro',patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u20', nome: 'SD Mateus Felipe',  patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u21', nome: 'SD Nicoly',         patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u22', nome: 'SD Nunes',          patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
  { id: 'u23', nome: 'SD Axl',            patente: 'SD',  habilitacoes: ['seguranca', 'condicoes', 'monitor1', 'monitor2', 'monitor3'] },
]

export function getUsuarioById(id: string): Usuario | undefined {
  return USUARIOS.find(u => u.id === id)
}

export function getUsuarioNome(id: string | null): string {
  if (!id) return '—'
  return getUsuarioById(id)?.nome ?? id
}
