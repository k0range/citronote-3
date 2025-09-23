import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import ja from './locales/ja.json';
import en from './locales/en.json';

const resources = {
  ja: { translation: ja },
  en: { translation: en }
} as const;

export function initI18n() {
  i18next.use(initReactI18next).init({
    lng: 'ja', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    debug: true,
    resources: resources
  });
}
