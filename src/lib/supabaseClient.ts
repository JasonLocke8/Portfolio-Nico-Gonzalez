import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

type SupabaseEnvName = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'

function getEnvValue(name: SupabaseEnvName): string | null {
  const raw = import.meta.env[name]
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  return value ? value : null
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

type SupabaseConfig = {
  url: string
  anonKey: string
}

function readSupabaseConfig(): { config: SupabaseConfig | null; error: string | null } {
  const urlRaw = getEnvValue('VITE_SUPABASE_URL')
  const anonKey = getEnvValue('VITE_SUPABASE_ANON_KEY')

  if (!urlRaw || !anonKey) {
    const missing: SupabaseEnvName[] = []
    if (!urlRaw) missing.push('VITE_SUPABASE_URL')
    if (!anonKey) missing.push('VITE_SUPABASE_ANON_KEY')
    return {
      config: null,
      error:
        `Missing ${missing.join(' & ')}. ` +
        'Configuralas como Environment Variables en Netlify (Site settings → Build & deploy → Environment).',
    }
  }

  try {
    const url = normalizeSupabaseUrl(urlRaw)
    return { config: { url, anonKey }, error: null }
  } catch (e) {
    return {
      config: null,
      error: e instanceof Error ? e.message : 'Invalid Supabase configuration.',
    }
  }
}

const { config, error } = readSupabaseConfig()

export const SUPABASE_URL: string | null = config?.url ?? null
export const SUPABASE_ANON_KEY: string | null = config?.anonKey ?? null
export const SUPABASE_CONFIG_ERROR: string | null = error

export const supabase: SupabaseClient | null = config ? createClient(config.url, config.anonKey) : null
