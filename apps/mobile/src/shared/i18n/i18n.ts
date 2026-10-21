import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {resources} from './resources';

export const supportedLanguages = [
  {code: 'ru', label: 'Русский'},
] as const;

export type AppLanguage = (typeof supportedLanguages)[number]['code'];

function getInitialLanguage(): AppLanguage {
  return 'ru';
}

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
  lng: getInitialLanguage(),
  react: {
    useSuspense: false,
  },
  resources,
  supportedLngs: supportedLanguages.map(language => language.code),
});

export {i18n};
