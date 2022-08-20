import { ptBR, zhCN, zhTW } from 'date-fns/locale';
import i18n from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import Backend from './Backend';
import Cache from './Cache';
import LanguageDetector from './LanguageDetector';
import {
  afZA,
  arSA,
  caES,
  csCZ,
  daDK,
  deDE,
  elGR,
  enUS,
  esES,
  fiFI,
  frFR,
  heIL,
  huHU,
  itIT,
  jaJP,
  koKR,
  nlNL,
  noNO,
  plPL,
  ptPT,
  roRO,
  ruRU,
  srSP,
  svSE,
  trTR,
  ukUA,
  viVN,
} from './translations';

const resources = {
  'af-ZA': {
    translation: afZA,
  },
  'ar-SA': {
    translation: arSA,
  },
  'ca-ES': {
    translation: caES,
  },
  'cs-CZ': {
    translation: csCZ,
  },
  'da-DK': {
    translation: daDK,
  },
  'de-DE': {
    translation: deDE,
  },
  'el-GR': {
    translation: elGR,
  },
  'en-US': {
    translation: enUS,
  },
  'es-ES': {
    translation: esES,
  },
  'fi-FI': {
    translation: fiFI,
  },
  'fr-FR': {
    translation: frFR,
  },
  'he-IL': {
    translation: heIL,
  },
  'hu-HU': {
    translation: huHU,
  },
  'it-IT': {
    translation: itIT,
  },
  'ja-JP': {
    translation: jaJP,
  },
  'ko-KR': {
    translation: koKR,
  },
  'nl-NL': {
    translation: nlNL,
  },
  'no-NO': {
    translation: noNO,
  },
  'pl-PL': {
    translation: plPL,
  },
  'pt-BR': {
    translation: ptBR,
  },
  'pt-PT': {
    translation: ptPT,
  },
  'ro-RO': {
    translation: roRO,
  },
  'ru-RU': {
    translation: ruRU,
  },
  'sr-SP': {
    translation: srSP,
  },
  'sv-SE': {
    translation: svSE,
  },
  'tr-TR': {
    translation: trTR,
  },
  'uk-UA': {
    translation: ukUA,
  },
  'vi-VN': {
    translation: viVN,
  },
  'zh-CN': {
    translation: zhCN,
  },
  'zh-TW': {
    translation: zhTW,
  },
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
      fallbackLng: 'en-US',
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
