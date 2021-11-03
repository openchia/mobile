import { atom, atomFamily, DefaultValue, selector } from 'recoil';
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

// eslint-disable-next-line import/prefer-default-export
export const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: 'Testing', // default value (aka initial value)
});

export const statsState = atom({
  key: 'statsAtom', // unique ID (with respect to other atoms/selectors)
  default: 'Testing', // default value (aka initial value)
});

export const statsRequestIDState = atomFamily({
  key: 'statsRequestAtomFamily',
  default: 0,
});

export const farmersRequestIDState = atomFamily({
  key: 'farmersRequestAtomFamily',
  default: 0,
});

export const blocksRequestIDState = atomFamily({
  key: 'blocksRequestAtomFamily',
  default: 0,
});

export const payoutsRequestIDState = atomFamily({
  key: 'payoutsRequestAtomFamily',
  default: 0,
});

export const farmerRequestIDState = atomFamily({
  key: 'farmerRequestAtomFamily',
  default: 0,
});
