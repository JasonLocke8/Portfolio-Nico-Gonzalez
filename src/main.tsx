import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

const App = lazy(() => import('./App.tsx'))
const Login = lazy(() => import('./pages/Login.tsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'))

const LoadingFallback = () => <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-gray-400">Cargando...</div></div>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
