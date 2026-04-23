// Controle local de interface — não é segurança forte.
// Para ativar admin neste navegador, execute no console:
//   localStorage.setItem('efr-admin', '1')
// Para desativar:
//   localStorage.removeItem('efr-admin')
// Alternativa: defina VITE_ADMIN=true em .env.local (baked no build local).
export function isAdmin(): boolean {
  if ((import.meta.env as Record<string, string | undefined>)['VITE_ADMIN'] === 'true') return true
  return localStorage.getItem('efr-admin') === '1'
}
