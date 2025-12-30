import { useEffect, useMemo, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, LocateFixed, LogOut, Home, Upload, LayoutDashboard, X } from 'lucide-react'
import { Logo } from '../components/Logo'
import { ParticlesBackground } from '../components/ParticlesBackground'
import { FloatingElements } from '../components/FloatingElements'
import { supabase } from '../lib/supabaseClient'
import { uploadToProjectFoto } from '../lib/uploadToProjectFoto'

type AlbumOption = {
  slug: string
  title: string | null
}

function getInvokeErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'No se pudieron cargar los álbumes.'

  const record = error as Record<string, unknown>
  const baseMessage = typeof record.message === 'string' ? record.message : 'No se pudieron cargar los álbumes.'

  const context = record.context
  if (!context || typeof context !== 'object') return baseMessage

  const ctx = context as Record<string, unknown>
  const status = typeof ctx.status === 'number' ? ctx.status : null
  const data = ctx.data

  const detailsError =
    data && typeof data === 'object' && 'error' in (data as Record<string, unknown>)
      ? (data as { error?: unknown }).error
      : null

  const details = typeof detailsError === 'string' ? detailsError : null
  if (status && details) return `${details} (HTTP ${status})`
  if (status) return `${baseMessage} (HTTP ${status})`
  return details ?? baseMessage
}

function getPayloadAlbums(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  const candidate = (payload as { albums?: unknown }).albums
  return Array.isArray(candidate) ? candidate : []
}

function isValidDDMMYYYY(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  const match = /^([0-3]\d)\/([01]\d)\/(\d{4})$/.exec(trimmed)
  if (!match) return false

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return false
  if (year < 1900 || year > 2100) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false

  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function formatDDMMYYYYInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  if (digits.length <= 2) return day
  if (digits.length <= 4) return `${day}/${month}`
  return `${day}/${month}/${year}`
}

function formatDateToDDMMYYYY(date: Date): string {
  const pad2 = (value: number) => String(value).padStart(2, '0')
  const day = pad2(date.getDate())
  const month = pad2(date.getMonth() + 1)
  const year = String(date.getFullYear())
  return `${day}/${month}/${year}`
}

async function reverseGeocodeCityCountry(lat: number, lon: number): Promise<string | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lon))

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) return null
  const payload: unknown = await response.json().catch(() => null)
  if (!payload || typeof payload !== 'object') return null

  const address = (payload as { address?: unknown }).address
  if (!address || typeof address !== 'object') return null

  const record = address as Record<string, unknown>
  const cityCandidate =
    record.city ??
    record.town ??
    record.village ??
    record.hamlet ??
    record.municipality ??
    record.county ??
    record.state

  const city = typeof cityCandidate === 'string' ? cityCandidate.trim() : ''
  const country = typeof record.country === 'string' ? record.country.trim() : ''

  if (city && country) return `${city}, ${country}`
  if (country) return country
  return null
}

export function Dashboard() {
  const navigate = useNavigate()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<'home' | 'upload'>('home')
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [albumSlug, setAlbumSlug] = useState('')
  const [albums, setAlbums] = useState<AlbumOption[]>([])
  const [areAlbumsLoading, setAreAlbumsLoading] = useState(false)
  const [albumsError, setAlbumsError] = useState<string | null>(null)

  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [takenAt, setTakenAt] = useState('')
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadSuccess, setIsUploadSuccess] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (isMounted) setSession(data.session)
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'No se pudo obtener la sesión.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/login', { replace: true })
    }
  }, [isLoading, session, navigate])

  const userEmail = useMemo(() => session?.user?.email ?? null, [session])

  useEffect(() => {
    if (!session) return

    let isMounted = true

    async function loadAlbums() {
      setAreAlbumsLoading(true)
      setAlbumsError(null)

      const { data, error } = await supabase.functions.invoke('proxy-list-albums', { method: 'GET' })
      if (!isMounted) return

      if (error) {
        setAlbumsError(getInvokeErrorMessage(error))
        setAlbums([])
        return
      }

      const albumsPayload = getPayloadAlbums(data as unknown)

      const normalized = albumsPayload
        .map((row) => {
          const record = (row ?? {}) as Record<string, unknown>
          return {
            slug: typeof record.slug === 'string' ? record.slug : '',
            title: typeof record.title === 'string' ? record.title : null,
          }
        })
        .filter((row) => row.slug.trim().length > 0)

      setAlbums(normalized)
    }

    loadAlbums().finally(() => {
      if (isMounted) setAreAlbumsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [session])

  const handleLogout = async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
      return
    }
    navigate('/login', { replace: true })
  }

  const handlePickFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFileName(file ? file.name : null)
    setSelectedFile(file)
    setIsUploadSuccess(false)
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setSelectedFileName(null)
    setError(null)
    setIsUploadSuccess(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUseDeviceLocation = async () => {
    setLocationError(null)

    if (!('geolocation' in navigator)) {
      setLocationError('Este dispositivo no soporta geolocalización.')
      return
    }

    setIsLocating(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12_000,
          maximumAge: 60_000,
        })
      })

      const lat = position.coords.latitude
      const lon = position.coords.longitude
      const cityCountry = await reverseGeocodeCityCountry(lat, lon)
      if (!cityCountry) {
        setLocationError('No se pudo obtener ciudad/país.')
        return
      }

      setLocation(cityCountry)
    } catch {
      setLocationError('No se pudo obtener la ubicación (permiso denegado o timeout).')
    } finally {
      setIsLocating(false)
    }
  }

  const handleUpload = async () => {
    setError(null)
    setLocationError(null)
    setIsUploadSuccess(false)

    if (!selectedFile) {
      setError('Selecciona un archivo primero.')
      return
    }

    if (!caption.trim()) {
      setError('Completa el campo caption.')
      return
    }

    if (!isValidDDMMYYYY(takenAt)) {
      setError('Fecha inválida. Usa DD/MM/YYYY.')
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadToProjectFoto(selectedFile, albumSlug, caption, {
        location,
        takenAt: takenAt.trim() ? takenAt.trim() : undefined,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }

      clearSelectedFile()
      setCaption('')
      setAlbumSlug('')
      setLocation('')
      setTakenAt('')
      setLocationError(null)
      setIsUploadSuccess(true)
    } finally {
      setIsUploading(false)
    }
  }

  const menuButtonBase =
    'w-full flex items-center gap-3 rounded-lg border px-4 py-2 transition-colors text-left'

  return (
    <div className="min-h-screen bg-gray-900 font-roboto relative flex flex-col overflow-hidden">
      <ParticlesBackground />
      <FloatingElements />

      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo />
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/"
            aria-label="Ir al inicio"
            className="inline-flex p-2 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Home size={28} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="inline-flex p-2 rounded-lg text-red-300 hover:text-red-100 transition-colors duration-200"
          >
            <LogOut size={28} />
          </button>
        </motion.div>
      </header>

      <main className="flex-1 w-full relative z-10 px-4 pt-28 pb-10">
        <motion.div
          className="w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="md:w-72 md:shrink-0">
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Menú</p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setActiveMenu('home')}
                    className={
                      activeMenu === 'home'
                        ? `${menuButtonBase} border-gray-600 text-gray-100`
                        : `${menuButtonBase} border-gray-800 text-gray-300 hover:border-gray-600 hover:text-gray-100`
                    }
                  >
                    <LayoutDashboard size={18} />
                    Inicio
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMenu('upload')}
                    className={
                      activeMenu === 'upload'
                        ? `${menuButtonBase} border-gray-600 text-gray-100`
                        : `${menuButtonBase} border-gray-800 text-gray-300 hover:border-gray-600 hover:text-gray-100`
                    }
                  >
                    <Upload size={18} />
                    Subir imagen
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-red-900/60 text-red-200 px-4 py-2 hover:border-red-700 hover:text-red-100 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </aside>

            <section className="flex-1">
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 md:p-8">
              {activeMenu === 'home' ? (
                <>
                  <motion.h1
                    className="text-3xl md:text-4xl font-light text-white mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                  >
                    Dashboard
                  </motion.h1>

                  <p className="text-gray-300">
                    {isLoading
                      ? 'Cargando…'
                      : userEmail
                        ? `Sesión iniciada como ${userEmail}`
                        : 'Sesión iniciada'}
                  </p>

                  {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
                </>
              ) : (
                <>
                  <motion.h1
                    className="text-3xl md:text-4xl font-light text-white mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                  >
                    Subir imagen
                  </motion.h1>

                  <p className="text-gray-300 mb-5">
                    Sube una foto a un album de Project Foto.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2" htmlFor="album_slug">
                        Álbum
                      </label>
                      <select
                        id="album_slug"
                        value={albumSlug}
                        onChange={(e) => setAlbumSlug(e.target.value)}
                        disabled={areAlbumsLoading}
                        className="w-full rounded-lg bg-gray-900 border border-gray-800 text-gray-100 px-4 py-2 outline-none focus:border-gray-600"
                      >
                        <option value="" disabled>
                          {areAlbumsLoading ? 'Cargando álbumes…' : 'Selecciona un álbum'}
                        </option>
                        {albums.map((album) => (
                          <option key={album.slug} value={album.slug}>
                            {(album.title ?? '').trim() ? album.title : album.slug}
                          </option>
                        ))}
                      </select>

                      {albumsError ? (
                        <p className="mt-2 text-xs text-red-200">No se pudieron cargar los álbumes: {albumsError}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2" htmlFor="caption">
                      Caption
                    </label>
                    <input
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Caption de la imagen"
                      className="w-full rounded-lg bg-gray-900 border border-gray-800 text-gray-100 px-4 py-2 outline-none focus:border-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label className="block text-sm text-gray-300" htmlFor="location">
                          Ubicación
                        </label>
                        <button
                          type="button"
                          onClick={handleUseDeviceLocation}
                          disabled={isLocating}
                          aria-label="Usar ubicación del dispositivo"
                          className="inline-flex items-center justify-center rounded-md border border-gray-800 p-1 text-gray-300 hover:text-gray-100 hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LocateFixed size={16} />
                        </button>
                      </div>

                      <input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ciudad, País"
                        className="w-full rounded-lg bg-gray-900 border border-gray-800 text-gray-100 px-4 py-2 outline-none focus:border-gray-600"
                      />

                      {locationError ? <p className="mt-2 text-xs text-red-200">{locationError}</p> : null}
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label className="block text-sm text-gray-300" htmlFor="taken_at">
                          Fecha
                        </label>
                        <button
                          type="button"
                          onClick={() => setTakenAt(formatDateToDDMMYYYY(new Date()))}
                          aria-label="Usar fecha actual"
                          className="inline-flex items-center justify-center rounded-md border border-gray-800 p-1 text-gray-300 hover:text-gray-100 hover:border-gray-600 transition-colors"
                        >
                          <CalendarDays size={16} />
                        </button>
                      </div>
                      <input
                        id="taken_at"
                        value={takenAt}
                        onChange={(e) => setTakenAt(formatDDMMYYYYInput(e.target.value))}
                        placeholder="DD/MM/YYYY"
                        inputMode="numeric"
                        className="w-full rounded-lg bg-gray-900 border border-gray-800 text-gray-100 px-4 py-2 outline-none focus:border-gray-600"
                      />
                    </div>
                  </div>

                  <label className="block rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-6 text-gray-300 hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-300">Selecciona una imagen</p>
                        <p className="text-xs text-gray-400 mt-1">JPG / PNG (sin subir todavía)</p>
                      </div>

                      <span className="rounded-lg border border-gray-700 text-gray-100 px-4 py-2">
                        Elegir archivo
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePickFile}
                      className="sr-only"
                    />
                  </label>

                  <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900/30 px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-300">
                      Archivo: <span className="text-gray-100">{selectedFileName ?? '---'}</span>
                    </p>

                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      disabled={!selectedFileName}
                      aria-label="Quitar archivo seleccionado"
                      className="inline-flex items-center justify-center rounded-md border border-gray-800 p-1 text-red-300 hover:text-red-200 hover:border-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 rounded-lg border border-gray-700 text-gray-100 px-4 py-2 hover:border-gray-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'Subiendo…' : 'Subir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        clearSelectedFile()
                        setCaption('')
                        setAlbumSlug('')
                        setLocation('')
                        setTakenAt('')
                        setLocationError(null)
                        setIsUploadSuccess(false)
                      }}
                      className="flex-1 rounded-lg border border-gray-800 text-gray-300 px-4 py-2 hover:border-gray-600 hover:text-gray-100 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>

                  {isUploadSuccess ? (
                    <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900/30 px-4 py-3">
                      <p className="text-sm text-green-200">Subida exitosa!</p>
                    </div>
                  ) : null}

                  {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
                </>
              )}
              </div>
            </section>
          </div>
        </motion.div>
      </main>

      <footer className="absolute bottom-0 right-0 p-6 z-20">
        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          © 2025
        </motion.p>
      </footer>
    </div>
  )
}

export default Dashboard
