import { atom, DefaultValue, selector } from 'recoil';
import { getObject, saveObject } from './utils/Utils';

const localForageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    setSelf(
      getObject(key).then(
        (savedValue) =>
          savedValue != null ? new Map(Object.entries(savedValue)) : new DefaultValue() // Abort initialization if no value was stored
      )
    );

    onSet((newValue) => {
      saveObject(key, Object.fromEntries(newValue));
    });
  };

export const launcherIDsState = atom({
  key: 'atomLauncherIDs',
  default: new Map(),
  effects_UNSTABLE: [localForageEffect('launcherIDs')],
});

// export const getSavedLauncherIDs = selector({
//   key: 'selectorLauncherIDs',
//   get: async ({ get, set }) => {
//     const launcherIDs = await getObject('launcherIDs');
//     set('atomLauncherIDs', launcherIDs);
//     return launcherIDs;
//   },
// });

// eslint-disable-next-line import/prefer-default-export
export const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: 'Testing', // default value (aka initial value)
});

export const statsState = atom({
  key: 'statsAtom', // unique ID (with respect to other atoms/selectors)
  default: 'Testing', // default value (aka initial value)
});
