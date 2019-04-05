import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './resources';

i18n.use(LanguageDetector).init({
  resources,
  fallbackLng: 'en-US',
  debug: true,

  // have a common namespace used around the full app
  ns: ['commom', 'navigation', 'auth', 'error'],
  defaultNS: 'commom',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ','
  },

  react: {
    wait: true
  }
});

export default i18n;
