import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <img src="https://i.imgur.com/yBGmBrR.png" alt="Sky" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-down">Nico Gonzalez</h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">Desarrollador Web</p>
        <button
          onClick={() => handleScroll('sobre-mí')}
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors duration-300 animate-bounce"
        >
          Conóceme
        </button>
      </div>
      <div className="absolute bottom-8 w-full flex justify-center animate-bounce">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};

export default Hero;