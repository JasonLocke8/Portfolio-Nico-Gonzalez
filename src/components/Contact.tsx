import React from 'react';
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-on-scroll text-gray-900 dark:text-white">
          Contacto
        </h2>
        <div className="max-w-lg mx-auto animate-on-scroll">
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            action="/thank-you"
            className="space-y-6"
          >
            <input type="hidden" name="form-name" value="contact" />
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 transition-all duration-300"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 transition-all duration-300"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 transition-all duration-300"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Enviar
                <Send className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;