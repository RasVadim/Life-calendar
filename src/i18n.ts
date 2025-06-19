import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en';
import translationRU from './locales/ru';

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
