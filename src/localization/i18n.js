import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './en';
import fr from './fr';
import de from './de';
import es from './es';
import hu from './hu';
import pl from './pl';
import ru from './ru';

const LANGUAGES = {
  en,
  fr,
  de,
  es,
  hu,
  pl,
  ru,
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    AsyncStorage.getItem('user-language', (err, language) => {
      // if error fetching stored data or no language was stored
      // display errors when in DEV mode as console statements
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from asyncstorage ', err);
        } else {
          console.log('No language is set, choosing English as fallback');
        }
        const findBestAvailableLanguage = RNLocalize.findBestAvailableLanguage(LANG_CODES);

        callback(findBestAvailableLanguage.languageTag || 'en');
        return;
      }
      callback(language);
    });
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    AsyncStorage.setItem('user-language', language);
  },
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    resources: LANGUAGES,
    compatibilityJSON: 'v3',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    // defaultNS: '',
  });
