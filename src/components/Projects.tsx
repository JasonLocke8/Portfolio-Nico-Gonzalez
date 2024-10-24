import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Fresh Bites',
    description: 'Proyecto sobre una tienda de comidas saludables. Tecnologías utilizadas: TS, React, Tailwind, ViteJS.',
    image: '../img/freshbites.png',
    link: '',
    demo: ''
  },
  {
    title: 'Proyecto 2',
    description: 'Proyecto 2. Tecnologías utilizadas: xD.',
    image: '',
    link: '',
    demo: ''
  },
  {
    title: 'Proyecto 3',
    description: 'Proyecto 3. Tecnologías utilizadas: xD.',
    image: '',
    link: '',
    demo: ''
  }
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
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