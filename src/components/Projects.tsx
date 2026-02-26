import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubUrl: string
  deployedUrl?: string
  status: 'deployed' | 'coming-soon' | 'in-development'
}

const PROJECTS: Project[] = [
  {
    id: 'project-foto',
    title: 'ProjectFoto',
    description: 'Plataforma para gestionar y compartir mis álbumes de fotos con mi familia y amigos.',
    tags: ['React', 'Supabase', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/JasonLocke8/ProjectFoto',
    deployedUrl: 'https://fotos.nicolito.com',
    status: 'deployed'
  },
  {
    id: 'spotify-player',
    title: 'Spotify Stream Player',
    description: 'Reproductor integrado de Spotify con controles avanzados y sincronización en tiempo real.',
    tags: ['React', 'Spotify API', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/JasonLocke8/SpotifyStreamPlayer',
    deployedUrl: 'https://player.nicolito.com',
    status: 'deployed'
  },
  {
    id: 'nostalgie-radio',
    title: 'Nostalgie Radio Show',
    description: 'Aplicación de radio con interfaz moderna. En proceso de lanzamiento en Google Play Store.',
    tags: ['React Native', 'Audio Streaming', 'Mobile'],
    githubUrl: 'https://github.com/JasonLocke8/Nostalgie-Radio-Show',
    status: 'coming-soon'
  },
  {
    id: 'obligatorio-p3',
    title: 'Sistema de Gestión de Envíos',
    description: 'Plataforma completa para la gestión, seguimiento y administración de envíos con reportes y estadísticas.',
    tags: ['.NET', 'SQL Server', 'C#', 'MVC'],
    githubUrl: 'https://github.com/JasonLocke8/ObligatorioP3',
    status: 'deployed'
  },
  {
    id: 'jason-bot',
    title: 'JasonBot 2.0',
    description: 'Bot de Discord multifuncional con comandos de ocio e información.',
    tags: ['Discord.js', 'Node.js', 'JavaScript', 'API'],
    githubUrl: 'https://github.com/JasonLocke8/JasonBot-2.0',
    status: 'deployed'
  },
  {
    id: 'fresh-bites',
    title: 'Fresh Bites',
    description: 'Sitio de e-commerce para compra de alimentos con catálogo dinámico y carrito de compras.',
    tags: ['HTML', 'CSS', 'JavaScript', 'E-commerce'],
    githubUrl: 'https://github.com/JasonLocke8/Fresh-Bites',
    status: 'coming-soon'
  }
]

export function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  }

  return (
    <section id="projects-section" className="min-h-screen w-full py-12 sm:py-16 md:py-24 relative z-10 snap-start snap-always flex items-center">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl w-full">
        {/* Section Header */}
        <motion.div
          className="mb-8 sm:mb-12 md:mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3 sm:mb-4">
            Proyectos
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Una selección de mis proyectos personales y profesionales. Algunos están completamente deployeados, otros en desarrollo o próximos a lanzar.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PROJECTS.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
