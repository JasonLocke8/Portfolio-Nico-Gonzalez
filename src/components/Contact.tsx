import React from 'react';
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-on-scroll">Contacto</h2>
        <div className="max-w-lg mx-auto animate-on-scroll">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
            >
              Enviar Mensaje
              <Send size={20} className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;