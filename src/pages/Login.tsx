import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ParticlesBackground } from '../components/ParticlesBackground'
import { FloatingElements } from '../components/FloatingElements'

export function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const savedRemember = localStorage.getItem('remember_login')
    const savedUsername = localStorage.getItem('remember_login_username')

    if (savedRemember === 'true') {
      setRemember(true)
      if (savedUsername) setUsername(savedUsername)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (remember) {
      localStorage.setItem('remember_login', 'true')
      localStorage.setItem('remember_login_username', username)
    } else {
      localStorage.removeItem('remember_login')
      localStorage.removeItem('remember_login_username')
    }

    // Login real: lo conectarás a tu lógica/backend cuando quieras.
  }

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
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <motion.div
          className="w-full max-w-md bg-gray-900/60 border border-gray-800 rounded-xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-light text-white mb-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Login
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm text-gray-300 mb-2">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-gray-900 border border-gray-800 text-gray-100 px-4 py-2 outline-none focus:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-gray-900 border border-gray-800 text-gray-100 px-4 py-2 outline-none focus:border-gray-600"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-300 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-gray-200"
              />
              Recordar
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-lg border border-gray-700 text-gray-100 px-4 py-2 hover:border-gray-500 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-lg border border-gray-800 text-gray-300 px-4 py-2 hover:border-gray-600 hover:text-gray-100 transition-colors"
              >
                Volver
              </button>
            </div>
          </form>
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
