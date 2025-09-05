import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  // load translation using http -> see /public/locales
  .use(HttpApi)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en', // use en if detected lng is not available
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}.json'
    }
  });

export default i18n;
