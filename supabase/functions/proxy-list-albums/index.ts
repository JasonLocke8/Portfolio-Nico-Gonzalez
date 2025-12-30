import { corsHeaders } from '../_shared/cors.ts'

declare const Deno: {
  env: {
    get: (name: string) => string | undefined
  }
  serve: (handler: (req: Request) => Response | Promise<Response>) => void
}

type AlbumOption = {
  slug: string
  title: string | null
}

type ListAlbumsSuccess = {
  ok: true
  albums: AlbumOption[]
}

type ErrorBody = {
  ok: false
  error: string
  details?: unknown
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  })
}

function envTrim(name: string): string | null {
  const value = Deno.env.get(name)
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeAlbumsPayload(payload: unknown): AlbumOption[] | null {
  const candidates: unknown[] | null = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? ((): unknown[] | null => {
          const record = payload as Record<string, unknown>
          if (Array.isArray(record.albums)) return record.albums
          if (Array.isArray(record.data)) return record.data
          if (Array.isArray(record.items)) return record.items
          return null
        })()
      : null

  if (!candidates) return null

  const normalized = candidates
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const record = row as Record<string, unknown>
      const slug = typeof record.slug === 'string' ? record.slug.trim() : ''
      const title = typeof record.title === 'string' ? record.title : null
      if (!slug) return null
      return { slug, title } satisfies AlbumOption
    })
    .filter((row): row is AlbumOption => Boolean(row))

  return normalized
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return json(
      {
        ok: false,
        error: `Method not allowed (${req.method}). Use GET.`,
      } satisfies ErrorBody,
      405,
      { Allow: 'GET, OPTIONS' },
    )
  }

  const adminSecret = envTrim('ADMIN_SECRET')
  const listAlbumsUrl = envTrim('LIST_ALBUMS_URL')

  if (!adminSecret) {
    return json(
      { ok: false, error: 'Server misconfigured (missing ADMIN_SECRET)' } satisfies ErrorBody,
      500,
    )
  }

  if (!listAlbumsUrl) {
    return json(
      { ok: false, error: 'Server misconfigured (missing LIST_ALBUMS_URL)' } satisfies ErrorBody,
      500,
    )
  }

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(listAlbumsUrl, {
      method: 'GET',
      headers: {
        'x-admin-secret': adminSecret,
        Accept: 'application/json',
      },
    })
  } catch (e) {
    return json(
      {
        ok: false,
        error: 'Upstream network error',
        details: e instanceof Error ? { message: e.message } : e,
      } satisfies ErrorBody,
      502,
    )
  }

  const contentType = upstreamResponse.headers.get('content-type') ?? ''
  const isJson = contentType.toLowerCase().includes('application/json')

  const payload = isJson
    ? await upstreamResponse.json().catch(() => null)
    : await upstreamResponse.text().catch(() => null)

  if (!upstreamResponse.ok) {
    return json(
      {
        ok: false,
        error: `Upstream error (HTTP ${upstreamResponse.status})`,
        details: payload,
      } satisfies ErrorBody,
      upstreamResponse.status,
    )
  }

  const albums = normalizeAlbumsPayload(payload)
  if (!albums) {
    return json(
      {
        ok: false,
        error: 'Unexpected upstream payload (expected albums with slug/title)',
        details: payload,
      } satisfies ErrorBody,
      502,
    )
  }

  return json({ ok: true, albums } satisfies ListAlbumsSuccess)
})
