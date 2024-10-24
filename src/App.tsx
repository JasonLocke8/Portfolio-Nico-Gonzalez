import React, { useState, useEffect } from 'react';
import { Sun, Moon, Github, Linkedin, Mail } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top <= windowHeight * 0.75) {
          el.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamar una vez al inicio para elementos ya visibles
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Hero />
        <main className="container mx-auto px-4 py-8">
          <About />
          <Projects />
          <Contact />
        </main>
        <footer className="bg-white dark:bg-gray-800 py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">&copy; 2024 JasonLocke. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <a href="https://github.com/JasonLocke8" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/nico-exe" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                <Linkedin size={24} />
              </a>
              <a href="mailto:contacto@nicolito.tech" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;