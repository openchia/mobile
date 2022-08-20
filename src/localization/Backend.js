/* eslint-disable import/no-unresolved */
// get from whatever version of react native that is being used.
import OtaClient from '@crowdin/ota-client';
import { CROWDIN_OTA_HASH } from '@env';

const Backend = {
  type: 'backend',
  init: (services, backendOptions, i18nextOptions) => {
    console.log('Backend init');
  },
  read: (language, namespace, callback) => {
    console.log('Backend read');
    const config = {
      disableManifestCache: true,
      disableJsonDeepMerge: true,
      disableLanguagesCache: true,
    };
    const client = new OtaClient(CROWDIN_OTA_HASH, config);
    client.setCurrentLocale(language);
    client.getStringsByLocale().then((res) => {
      if (res) {
        console.log('Successfully updated');
        return callback(null, res);
      }
      return callback(null, null);
    });
  },

  save: (language, namespace, data) => {
    console.log('Backend save');
  },

  create: (languages, namespace, key, fallbackValue) => {
    console.log('Backend create');
  },
};

export default Backend;
