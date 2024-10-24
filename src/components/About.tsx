import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-on-scroll">Sobre mí</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-on-scroll">
            <img
              src="/img/profile.png"
              alt="Nico Gonzalez"
              className="rounded-full w-64 h-64 object-cover mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="md:w-1/2 md:pl-12 animate-on-scroll">
            <p className="text-lg mb-6 leading-relaxed">
              Hola, mi nombre es <span className="font-semibold text-blue-600 dark:text-blue-400">Nicolás González</span>, un desarrollador web apasionado por crear experiencias digitales únicas y funcionales. Entre las tecnologías que manejo están HTML, CSS, JavaScript, C# y SQL. Disfruto trabajando en proyectos desafiantes que me permitan aprender y crecer profesionalmente.
            </p>
            <p className="text-lg leading-relaxed">
              Cuando no estoy programando, me gusta jugar videojuegos, disfrutar de un recorrido en bicicleta o hacer algún deporte como Futbol. Siempre estoy buscando nuevas oportunidades para colaborar en proyectos interesantes y expandir mis habilidades.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;