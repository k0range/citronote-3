import 'i18next';
import ja from '../locales/ja.json';

// JSONを型にする
type TranslationType = typeof ja;

declare module 'i18next' {
  interface CustomTypeOptions {
    // defaultNS: 'common' としてるならここも合わせる
    defaultNS: 'translation';
    resources: {
      translation: TranslationType;
    };
  }
}
