import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getLocale } from './en_th'
import { doc, Firestore, getDoc } from 'firebase/firestore'

export const initI18Next = () => {
  const detectionOptions = {
    lookupLocalStorage: 'i18nextLng',
    caches: [localStorage]
  }
  const languageDetector = new LanguageDetector()
  languageDetector.init(detectionOptions)
  i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
      resources: {
        en: {
          translation: getLocale('en')
        },
        th: {
          translation: getLocale('th')
        }
      },
      lng: window.localStorage.defaultLanguage,
      fallbackLng: 'en'
    })
}

interface langTypes {
  name: string
  value: {
    [key: string]: string | { [key: string]: string }
  }
}

export const loadFromFB = async (db: Firestore): Promise<langTypes[]> => {
  const en =
    (await getDoc(doc(db, 'i18next', 'en'))).data() ||
    ({} as langTypes['value'])
  const th =
    (await getDoc(doc(db, 'i18next', 'th'))).data() ||
    ({} as langTypes['value'])
  return [
    { name: 'en', value: Object.assign({}, en, getLocale('en')) },
    { name: 'th', value: Object.assign({}, th, getLocale('th')) }
  ]
}

export const t = (text: string) => useTranslation().t(text)
