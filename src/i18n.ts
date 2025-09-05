import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa los archivos de traducción directamente
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Define los recursos de traducción
const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

i18n
  // Detecta el idioma del usuario
  .use(LanguageDetector)
  // Pasa la instancia de i18n a react-i18next.
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    resources, // Carga las traducciones directamente
    fallbackLng: 'es', // Usa 'es' si el idioma detectado no está disponible
    interpolation: {
      escapeValue: false // React ya protege contra XSS
    }
  });

export default i18n;