import { Github, Linkedin, Mail, Download, ScanFace } from 'lucide-react'
import { motion } from 'framer-motion'
import { Logo } from './components/Logo'
import { ParticlesBackground } from './components/ParticlesBackground'
import { FloatingElements } from './components/FloatingElements'

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
    <div className="min-h-screen bg-gray-900 font-roboto relative flex flex-col overflow-hidden">
      {/* Fondo de Estrellas */}
      <ParticlesBackground />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
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
          <ScanFace size={32} />
        </motion.div>

      </header>



      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        <motion.h1
          className="text-6xl md:text-7xl font-light text-white mb-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Nicolás González
        </motion.h1>
        <motion.h2
          className="text-xl md:text-2xl font-light text-gray-300 mb-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          Analista Programador
        </motion.h2>

        {/* Social */}
        <motion.div
          className="flex space-x-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            href="https://github.com/JasonLocke8"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="GitHub"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Github size={32} />
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/nico-exe/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin size={32} />
          </motion.a>

          <motion.button
            onClick={handleEmailClick}
            className="p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Email"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Mail size={32} />
          </motion.button>

          <motion.button
            onClick={handleCVDownload}
            className="p-3 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Descargar CV"
            variants={iconVariants}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Download size={32} />
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 right-0 p-6 z-10">
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
