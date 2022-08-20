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
      const findBestAvailableLanguage = RNLocalize.findBestAvailableLanguage([
        'af-ZA',
        'ar-SA',
        'ca-ES',
        'cs-CZ',
        'da-DK',
        'de-DE',
        'el-GR',
        'en-US',
        'es-ES',
        'fi-FI',
        'fr-FR',
        'he-IL',
        'hu-HU',
        'it-IT',
        'ja-JP',
        'ko-KR',
        'nl-NL',
        'no-NO',
        'pl-PL',
        'pt-BR',
        'pt-PT',
        'ro-RO',
        'ru-RU',
        'sr-SP',
        'sv-SE',
        'tr-TR',
        'uk-UA',
        'vi-VN',
        'zh-CN',
        'zh-TW',
      ]);
      // console.log(
      //   'LanguageDetector:',
      //   findBestAvailableLanguage ? findBestAvailableLanguage.languageTag : 'en-US'
      // );

      return findBestAvailableLanguage ? findBestAvailableLanguage.languageTag : 'en-US';
    }
    // console.log('LanguageDetector:', languageCode);
    return languageCode;
  },
  init: () => {},
  cacheUserLanguage: (languageCode) => {
    // console.log('save', languageCode);
    storage.set(LANGUAGE_CODE, languageCode);
  },
};

export default LanguageDetector;
