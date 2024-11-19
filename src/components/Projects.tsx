import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Fresh Bites',
    description: 'Proyecto sobre una tienda de comidas saludables. Tecnologías utilizadas: TS, React, Tailwind, ViteJS.',
    image: 'https://i.imgur.com/yhCKutD.png',
    link: 'https://github.com/JasonLocke8/Fresh-Bites',
    demo: ''
  },
  {
    title: 'Cercle Music',
    description: 'Proyecto sobre un festival de música. Página realizada para ORT. Tecnologías utilizadas: HTML y CSS.',
    image: 'https://imgur.com/P7LZ4Gc.png',
    link: 'https://github.com/JasonLocke8/Cercle-Music-Festival---ORT.git',
    demo: 'https://jasonlocke8.github.io/Cercle-Music-Festival---ORT/'
  },
  {
    title: 'JasonBot 2.0',
    description: 'Un bot de discord básico para uso informativo sobre estrategias de un juego. Tecnologías utilizadas: TypeScript y JS.',
    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fdiscord&psig=AOvVaw0USQ6DpzB3uBYRCPVHf-xC&ust=1732131837674000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLj924mU6YkDFQAAAAAdAAAAABAE',
    link: 'https://github.com/JasonLocke8/JasonBot-2.0.git',
    demo: ''
  }
];

const Projects: React.FC = () => {
  return (
    <section id="proyectos" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 my-12">
        <h2 className="text-4xl font-bold mb-12 text-center">Mis Proyectos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="relative">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-center">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm">{project.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Github size={20} className="mr-1" />
                    Código
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline"
                  >
                    Demo
                    <ExternalLink size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;