import { createClient } from '@supabase/supabase-js'

const url  = (import.meta.env as Record<string, string>)['VITE_SUPABASE_URL']  ?? ''
const key  = (import.meta.env as Record<string, string>)['VITE_SUPABASE_ANON_KEY'] ?? ''

export const supabase = createClient(url, key)
