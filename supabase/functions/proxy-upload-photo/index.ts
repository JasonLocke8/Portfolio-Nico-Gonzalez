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

  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return json({ ok: false, error: 'Expected multipart/form-data' } satisfies ErrorBody, 415)
  }

  const adminSecret = envTrim('ADMIN_SECRET')
  const projectFotoUploadUrl = envTrim('PROJECTFOTO_UPLOAD_URL')

  if (!adminSecret) {
    return json(
      { ok: false, error: 'Server misconfigured (missing ADMIN_SECRET)' } satisfies ErrorBody,
      500,
    )
  }

  if (!projectFotoUploadUrl) {
    return json(
      { ok: false, error: 'Server misconfigured (missing PROJECTFOTO_UPLOAD_URL)' } satisfies ErrorBody,
      500,
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return json({ ok: false, error: 'Invalid form data' } satisfies ErrorBody, 400)
  }

  const file = form.get('file')
  const albumSlug = form.get('album_slug')
  const alt = form.get('alt')
  const caption = form.get('caption')
  const location = form.get('location')
  const takenAt = form.get('taken_at')

  if (!(file instanceof File)) {
    return json({ ok: false, error: 'Missing file' } satisfies ErrorBody, 400)
  }
  if (typeof albumSlug !== 'string' || !albumSlug.trim()) {
    return json({ ok: false, error: 'Missing album_slug' } satisfies ErrorBody, 400)
  }

  const forward = new FormData()
  forward.append('file', file)
  forward.append('album_slug', albumSlug)
  // Some upstreams still require `alt`. If the client doesn't send it, derive it from caption.
  const derivedAlt =
    typeof alt === 'string' && alt.trim()
      ? alt.trim()
      : typeof caption === 'string' && caption.trim()
        ? caption.trim()
        : 'Imagen'
  forward.append('alt', derivedAlt)
  if (typeof caption === 'string' && caption.trim()) forward.append('caption', caption)
  // Forward exactly what the client sent for these fields.
  if (typeof location === 'string' && location.length > 0) forward.append('location', location)
  if (typeof takenAt === 'string' && takenAt.length > 0) forward.append('taken_at', takenAt)

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(projectFotoUploadUrl, {
      method: 'POST',
      headers: {
        'x-admin-secret': adminSecret,
        // IMPORTANT: Do NOT set Content-Type manually when using FormData.
      },
      body: forward,
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
