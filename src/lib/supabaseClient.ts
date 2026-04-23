import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env as Record<string, string>)['VITE_SUPABASE_URL'] ?? ''
const key = (import.meta.env as Record<string, string>)['VITE_SUPABASE_ANON_KEY'] ?? ''

// createClient lança exceção com strings vazias — guard necessário quando vars não estão no build
export const supabase = url && key
  ? createClient(url, key)
  : (null as unknown as ReturnType<typeof createClient>)
