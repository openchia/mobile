import i18n from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import Backend from './Backend';
import Cache from './Cache';
import LanguageDetector from './LanguageDetector';
import en from './en-US.json';
// import de from './de.json';

const resources = {
  en: {
    translation: en,
  },
  // de: {
  //   translation: de,
  // },
};

i18n
  .use(LanguageDetector)
  .use(ChainedBackend)
  .use(initReactI18next)
  .init(
    {
      compatibilityJSON: 'v3',
      react: {
        useSuspense: false,
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
      backend: {
        backends: [Cache, Backend, resourcesToBackend(resources)],
        backendOptions: [],
      },
    },
    () => {
      console.log('finsihed loading');
    }
  );

export default i18n;
