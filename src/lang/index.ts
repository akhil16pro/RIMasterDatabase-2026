import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locale/en.json'
import ar from './locale/ar.json'

// Resources for different languages
const resources = {
  en: en,
  ar: ar
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    detection: {
      order: ['navigator', 'querystring', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      lookupLocalStorage: 'i18nextLng',
      excludeCacheFor: ['cimode']
    },
    react: {
      useSuspense: false
    },
    debug: false,
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n