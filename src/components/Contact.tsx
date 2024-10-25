import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as any).toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-on-scroll text-gray-900 dark:text-white">
          Contacto
        </h2>
        <div className="max-w-lg mx-auto animate-on-scroll">
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
              ¡Mensaje enviado con éxito! Gracias por contactarnos.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
            </div>
          )}
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                No llenar si eres humano: <input name="bot-field" />
              </label>
            </p>
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
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 transition-all duration-300"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
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