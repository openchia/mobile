import { MMKV } from 'react-native-mmkv';

// export const storage = new MMKV();

function getDefaults() {
  return {
    expirationTime: 1 * 24 * 60 * 60 * 1000,
    // expirationTime: 1000 * 60 * 5,
  };
}

class Cache {
  constructor(services, options = {}) {
    this.init(services, options);

    this.type = 'backend';
  }

  init(services, options = {}) {
    this.services = services;
    this.options = { ...getDefaults(), ...this.options, ...options };
    this.storage = new MMKV();
  }

  read(language, namespace, callback) {
    const nowMS = new Date().getTime();

    console.log('Cache Language: ', language);

    if (!this.storage) {
      return callback(null, null);
    }

    let local = this.storage.getString(language);

    if (local) {
      console.log('Cache Language found');

      local = JSON.parse(local);
      if (local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS) {
        delete local.i18nStamp;
        return callback(null, local);
      }
    }
    console.log('Cache Language not found');

    return callback(null, null);
  }

  save(language, namespace, data) {
    if (this.storage) {
      data.i18nStamp = new Date().getTime();
      console.log('Cache Save', data);
      this.storage.set(language, JSON.stringify(data));
    }
  }

  // getVersion(language) {
  //   return this.options.versions[language] || this.options.defaultVersion;
  // }
}

Cache.type = 'backend';

export default Cache;
