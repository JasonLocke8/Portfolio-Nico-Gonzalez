import { SUPABASE_ANON_KEY, SUPABASE_URL, supabase } from './supabaseClient'

export type ProjectFotoUploadedPhoto = {
  id: string
  image_path: string
  public_url: string
}

export type ProjectFotoUploadSuccess = {
  ok: true
  photo: ProjectFotoUploadedPhoto
}

function getPayloadError(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  if (!('error' in payload)) return null
  const candidate = (payload as { error?: unknown }).error
  return typeof candidate === 'string' ? candidate : null
}

function isProjectFotoUploadSuccess(payload: unknown): payload is ProjectFotoUploadSuccess {
  if (!payload || typeof payload !== 'object') return false
  if (!('ok' in payload) || (payload as { ok?: unknown }).ok !== true) return false
  if (!('photo' in payload)) return false

  const photo = (payload as { photo?: unknown }).photo
  if (!photo || typeof photo !== 'object') return false

  const record = photo as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.image_path === 'string' &&
    typeof record.public_url === 'string'
  )
}

type UploadResult = {
  ok: true
  photo: ProjectFotoUploadedPhoto
} | {
  ok: false
  error: string
  status?: number
  details?: unknown
}

type UploadMetadata = {
  location?: string
  takenAt?: string
}

export async function uploadToProjectFoto(
  file: File,
  albumSlug: string,
  caption: string,
  metadata: UploadMetadata = {},
): Promise<UploadResult> {
  if (!file) {
    return { ok: false, error: 'Falta el archivo.' }
  }
  if (!albumSlug?.trim()) {
    return { ok: false, error: 'Selecciona un álbum.' }
  }
  if (!caption?.trim()) {
    return { ok: false, error: 'Falta la caption.' }
  }

  const { data, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    return { ok: false, error: sessionError.message }
  }

  const accessToken = data.session?.access_token
  if (!accessToken) {
    return { ok: false, error: 'No hay sesión activa.' }
  }

  const form = new FormData()
  form.append('file', file)
  form.append('album_slug', albumSlug.trim())
  form.append('caption', caption.trim())
  if (metadata.location?.trim()) form.append('location', metadata.location.trim())
  if (metadata.takenAt?.trim()) form.append('taken_at', metadata.takenAt.trim())

  const proxyUrl = new URL('/functions/v1/proxy-upload-photo', SUPABASE_URL).toString()

  try {
    console.info('[uploadToProjectFoto] POST', proxyUrl)
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_ANON_KEY,
        Accept: 'application/json',
      },
      body: form,
    })

    console.info('[uploadToProjectFoto] response', {
      status: response.status,
      redirected: response.redirected,
      finalUrl: response.url,
    })

    const contentType = response.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')

    const payload = isJson
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null)

    if (!response.ok) {
      if (response.redirected) {
        return {
          ok: false,
          error:
            'La request fue redireccionada. Revisa VITE_SUPABASE_URL (usa https://<project-ref>.supabase.co y sin path).',
          status: response.status,
          details: { finalUrl: response.url, payload },
        }
      }
      const message = getPayloadError(payload) ?? `Error HTTP ${response.status}`
      return { ok: false, error: message, status: response.status, details: payload }
    }

    if (!isProjectFotoUploadSuccess(payload)) {
      return {
        ok: false,
        error: 'Respuesta inesperada de proxy-upload-photo.',
        status: response.status,
        details: payload,
      }
    }

    return { ok: true, photo: payload.photo }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error de red.' }
  }
}
