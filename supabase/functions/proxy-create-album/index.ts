import { corsHeaders } from '../_shared/cors.ts'

declare const Deno: {
  env: {
    get: (name: string) => string | undefined
  }
  serve: (handler: (req: Request) => Response | Promise<Response>) => void
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json(
      {
        ok: false,
        error: `Method not allowed (${req.method}). Use POST.`,
      } satisfies ErrorBody,
      405,
      { Allow: 'POST, OPTIONS' },
    )
  }

  const adminSecret = envTrim('ADMIN_SECRET')
  const projectFotoUploadAlbumUrl = envTrim('PROJECTFOTO_UPLOAD_ALBUM_URL')

  if (!adminSecret) {
    return json(
      { ok: false, error: 'Server misconfigured (missing ADMIN_SECRET)' } satisfies ErrorBody,
      500,
    )
  }

  if (!projectFotoUploadAlbumUrl) {
    return json(
      { ok: false, error: 'Server misconfigured (missing PROJECTFOTO_UPLOAD_ALBUM_URL)' } satisfies ErrorBody,
      500,
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' } satisfies ErrorBody, 400)
  }

  if (!body || typeof body !== 'object') {
    return json({ ok: false, error: 'Body must be an object' } satisfies ErrorBody, 400)
  }

  const record = body as Record<string, unknown>
  const title = record.title
  const subtitle = record.subtitle
  const slug = record.slug
  const isVisible = record.is_visible
  const coverPath = record.cover_path

  if (typeof title !== 'string' || !title.trim()) {
    return json({ ok: false, error: 'Missing or invalid title' } satisfies ErrorBody, 400)
  }

  if (typeof subtitle !== 'string' || !subtitle.trim()) {
    return json({ ok: false, error: 'Missing or invalid subtitle' } satisfies ErrorBody, 400)
  }

  if (typeof slug !== 'string' || !slug.trim()) {
    return json({ ok: false, error: 'Missing or invalid slug' } satisfies ErrorBody, 400)
  }

  if (typeof isVisible !== 'boolean') {
    return json({ ok: false, error: 'Missing or invalid is_visible (must be boolean)' } satisfies ErrorBody, 400)
  }

  if (typeof coverPath !== 'string') {
    return json({ ok: false, error: 'Missing or invalid cover_path (must be string)' } satisfies ErrorBody, 400)
  }

  const payload = {
    title: title.trim(),
    subtitle: subtitle.trim(),
    slug: slug.trim(),
    is_public: isVisible,
    cover_path: coverPath,
  }

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(projectFotoUploadAlbumUrl, {
      method: 'POST',
      headers: {
        'x-admin-secret': adminSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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

  const upstreamBody = await upstreamResponse.arrayBuffer()
  const responseHeaders = new Headers(corsHeaders)

  const upstreamContentType = upstreamResponse.headers.get('content-type')
  if (upstreamContentType) responseHeaders.set('content-type', upstreamContentType)

  return new Response(upstreamBody, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  })
})
