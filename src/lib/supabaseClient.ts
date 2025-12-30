import { createClient } from '@supabase/supabase-js'

function getRequiredEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY') {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to your .env file (Vite only exposes variables prefixed with VITE_).`,
    )
  }
  return String(value)
}

function normalizeSupabaseUrl(input: string) {
  const trimmed = input.trim().replace(/\/+$/, '')

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error(
      `Invalid VITE_SUPABASE_URL: "${input}". Expected something like https://<project-ref>.supabase.co`,
    )
  }

  if (parsed.protocol === 'http:' && parsed.hostname.endsWith('supabase.co')) {
    parsed.protocol = 'https:'
  }

  return parsed.origin
}

const supabaseUrl = normalizeSupabaseUrl(getRequiredEnv('VITE_SUPABASE_URL'))
const supabaseAnonKey = getRequiredEnv('VITE_SUPABASE_ANON_KEY')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const SUPABASE_URL = supabaseUrl
export const SUPABASE_ANON_KEY = supabaseAnonKey
