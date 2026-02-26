import { Github, Linkedin, Mail, Download, ScanFace, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Logo } from './components/Logo'
import { ParticlesBackground } from './components/ParticlesBackground'
import { FloatingElements } from './components/FloatingElements'
import { Projects } from './components/Projects'

function App() {

  const handleEmailClick = () => {
    window.location.href = 'mailto:nicogonzalez2000@gmail.com'
  }

  const handleCVDownload = () => {
    const link = document.createElement('a')
    link.href = '/Nicolas_Gonzalez_CV.pdf'
    link.download = 'Nicolas_Gonzalez_CV.pdf'
    link.click()
  }

  const handleScrollToProjects = () => {
    const projectsSection = document.getElementById('projects-section')
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.9
      }
    }
  }

  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  }

  return (
    <div className="h-screen bg-gray-900 font-roboto relative overflow-y-auto snap-y snap-proximity">
      {/* Fondo de Estrellas */}
      <ParticlesBackground />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Header */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo />
        </motion.div>

        <motion.div
          className="text-gray-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            to="/login"
            aria-label="Ir al login"
            className="inline-flex p-2 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
          >
            <ScanFace size={32} />
          </Link>
        </motion.div>

      </header>



      {/* Main */}
      <main className="min-h-screen flex flex-col items-center justify-center relative z-10 snap-start snap-always px-4">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Nicolás González
        </motion.h1>
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl font-light text-gray-300 mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          Analista Programador
        </motion.h2>

        {/* Social */}
        <motion.div
          className="flex space-x-4 sm:space-x-6 md:space-x-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            href="https://github.com/JasonLocke8"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="GitHub"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Github size={28} className="sm:w-8 sm:h-8" />
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/nico-exe/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin size={28} className="sm:w-8 sm:h-8" />
          </motion.a>

          <motion.button
            onClick={handleEmailClick}
            className="p-2 sm:p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Email"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Mail size={28} className="sm:w-8 sm:h-8" />
          </motion.button>

          <motion.button
            onClick={handleCVDownload}
            className="p-2 sm:p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Descargar CV"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Download size={28} className="sm:w-8 sm:h-8" />
          </motion.button>
        </motion.div>

        {/* Scroll Arrow */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={handleScrollToProjects}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-gray-700/30 hover:bg-gray-700/50 transition-colors">
            <ChevronDown size={24} className="sm:w-7 sm:h-7 text-gray-300 opacity-60" />
          </div>
        </motion.div>
      </main>

      {/* Projects Section */}
      <Projects />

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-gray-800 z-10">
        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          © 2025
        </motion.p>
      </footer>

    </div>
  )
}

export default App
