import { MMKV } from 'react-native-mmkv';
import * as RNLocalize from 'react-native-localize';

const storage = new MMKV();

const LANGUAGE_CODE = 'languageCode';

const LanguageDetector = {
  type: 'languageDetector',
  async: false,
  detect: (callback) => {
    const languageCode = storage.getString(LANGUAGE_CODE);
    if (!languageCode) {
      const findBestAvailableLanguage = RNLocalize.findBestAvailableLanguage(['en', 'de']);
      console.log(
        'LanguageDetector:',
        findBestAvailableLanguage ? findBestAvailableLanguage.languageTag : 'en'
      );

      return findBestAvailableLanguage ? findBestAvailableLanguage.languageTag : 'en';
    }
    console.log('LanguageDetector:', languageCode);
    return languageCode;
  },
  init: () => {},
  cacheUserLanguage: (languageCode) => {
    storage.set(LANGUAGE_CODE, languageCode);
  },
};

export default LanguageDetector;
