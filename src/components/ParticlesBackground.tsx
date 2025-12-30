import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  baseOpacity: number
  twinkleSpeed: number
  brightness: number
  vx: number
  vy: number
}

export const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createStars = () => {
      const stars: Star[] = []
      const starCount = 150

      for (let i = 0; i < starCount; i++) {
        const brightness = Math.random()
        
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          baseOpacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.003 + 0.001,
          brightness: brightness,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2
        })
      }

      starsRef.current = stars
    }

    const drawStars = () => {
      // Fondo espacial
      ctx.fillStyle = '#000011'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() * 0.001

      starsRef.current.forEach(star => {
        // Actualizar posición
        star.x += star.vx
        star.y += star.vy

        // Rebotar en los bordes o reposicionar
        if (star.x < 0 || star.x > canvas.width) {
          star.vx = -star.vx
          star.x = Math.max(0, Math.min(canvas.width, star.x))
        }
        if (star.y < 0 || star.y > canvas.height) {
          star.vy = -star.vy
          star.y = Math.max(0, Math.min(canvas.height, star.y))
        }

        // Efecto de parpadeo
        const twinkle = Math.sin(time * star.twinkleSpeed + star.x) * 0.2
        star.opacity = Math.max(0.1, star.baseOpacity + twinkle)

        // Color basado en el brillo
        let color = 'rgba(255, 255, 255, ' + star.opacity + ')'
        
        if (star.brightness > 0.8) {
          // Estrellas muy brillantes - azul/blanco
          color = 'rgba(200, 220, 255, ' + star.opacity + ')'
        } else if (star.brightness > 0.6) {
          // Estrellas brillantes - amarillo/blanco
          color = 'rgba(255, 250, 200, ' + star.opacity + ')'
        }

        // Dibujar estrella
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Añadir resplandor a estrellas brillantes
        if (star.brightness > 0.7) {
          ctx.shadowColor = color
          ctx.shadowBlur = star.size * 2
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })
    }

    const animate = () => {
      drawStars()
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createStars()
    animate()

    const handleResize = () => {
      resizeCanvas()
      createStars()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
