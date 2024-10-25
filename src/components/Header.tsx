import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-800 shadow-md' : 'bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>NG</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {['Inicio', 'Sobre mí', 'Proyectos', 'Contacto'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleScrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              isScrolled
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
          <ul className="py-4 flex flex-col items-center">
            {['Inicio', 'Sobre mí', 'Proyectos', 'Contacto'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => {
                    handleScrollToSection(item.toLowerCase().replace(' ', '-'));
                    setIsMenuOpen(false); // Cierra el menú después de hacer clic
                  }}
                  className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 ${
                    isScrolled || darkMode ? 'text-gray-900 dark:text-white' : 'text-gray-900'
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;