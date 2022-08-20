/* eslint-disable new-cap */
import otaClient from '@crowdin/ota-client';
import get from 'lodash.get';
import React, { createContext, useContext, useState } from 'react';
import * as RNLocalize from 'react-native-localize';
import { MMKV } from 'react-native-mmkv';
import t, { DEFAULT_LANGUAGE, translations } from '../localization/translations/translations';

// const config = {
//   //   disableManifestCache: true,
//   //   disableStringsCache: true,
//   //   disableJsonDeepMerge: true,
//   disableLanguagesCache: true,
// };

// const hash = '744697c6257aff490d280c90zfc';
// const client = new otaClient(hash, config);
const storage = new MMKV();

const APP_LANGUAGE = 'appLanguage';

export const LocalizationContext = createContext({
  t,
  setAppLanguage: () => {},
  appLanguage: DEFAULT_LANGUAGE,
  initializeAppLanguage: () => {},
});

export const LocalizationProvider = ({ children }) => {
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);
  const [state, setState] = useState();

  const setLanguage = (langCode, data) => {
    t.setLanguage(langCode);
    storage.set(APP_LANGUAGE, langCode);
    setAppLanguage(langCode);
    setState({});
    // console.log('Save language code: ', langCode);
  };

  const updateTranslation = async (langCode) => {
    const config = {
      disableManifestCache: true,
      disableJsonDeepMerge: true,
      disableLanguagesCache: true,
    };
    const hash = '744697c6257aff490d280c90zfc';
    const client = new otaClient(hash, config);
    client.setCurrentLocale(langCode);
    const res = await client.getStringsByLocale();
    if (res) {
      t.setContent({
        [langCode]: res,
      });
      storage.set('lang', JSON.stringify(res));
      setLanguage(langCode);
      console.log('Successfully updated t', langCode);
    }
  };

  const initLanguage = () => {
    let langCode = storage.getString(APP_LANGUAGE);
    const langData = storage.getString('lang');
    const LANG_CODES = Object.keys(translations);

    if (!langCode) {
      langCode = DEFAULT_LANGUAGE;
      //   const supportedLocaleCodes = t.getAvailableLanguages();
      const phoneLocaleCodes = RNLocalize.getLocales().map((locale) => locale.languageCode);
      phoneLocaleCodes.some((code) => {
        if (LANG_CODES.includes(code)) {
          langCode = code;
          return true;
        }
      });
      setLanguage(langCode);
      storage.set('lang', JSON.stringify(translations[langCode]));
    } else {
      t.setContent({
        [langCode]: JSON.parse(langData),
      });
      setLanguage(langCode);
    }
    // updateTranslation(langCode);
  };

  return (
    <LocalizationContext.Provider
      value={{
        t,
        setAppLanguage: setLanguage,
        appLanguage,
        initLanguage,
        updateTranslation,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

// const get = (from, ...selectors) =>
//   [...selectors].map((s) =>
//     s
//       .replace(/\[([^\[\]]*)\]/g, '.$1.')
//       .split('.')
//       .filter((t) => t !== '')
//       .reduce((prev, cur) => prev && prev[cur], from)
//   );

const dig = (obj, target) =>
  target in obj
    ? obj[target]
    : Object.values(obj).reduce((acc, val) => {
        if (acc !== undefined) return acc;
        if (typeof val === 'object') return dig(val, target);
      }, undefined);

const data = {
  level1: {
    level2: {
      level3: 'some data',
    },
  },
};

export const useTranslation = (options) => {
  const authContext = useContext(LocalizationContext);
  if (authContext == null) {
    throw new Error('useTranslation() called outside of a app?');
  }
  // console.log(get(authContext.t, options.keyPrefix), options.keyPrefix);
  // console.log(options && authContext.t[options.keyPrefix]);
  if (options) {
    // console.log({ ...authContext, t: dig(authContext.t, options.keyPrefix) });
    // console.log(authContext);
    // console.log({ ...authContext, t: get(authContext.t, options.keyPrefix) });
    return { ...authContext, t: get(authContext.t, options.keyPrefix) };
  }
  return authContext;
};
