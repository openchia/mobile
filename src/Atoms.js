import { atom, atomFamily, DefaultValue, selector } from 'recoil';
import { getObject, saveObject } from './utils/Utils';

const localForageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    setSelf(
      getObject(key).then(
        (savedValue) => (savedValue != null ? Object.entries(savedValue) : new DefaultValue()) // Abort initialization if no value was stored
      )
    );

    onSet((newValue) => {
      saveObject(key, newValue);
    });
  };

const localTokenEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    setSelf(
      getObject(key).then(
        (savedValue) =>
          savedValue != null ? new Set(Object.entries(savedValue)) : new DefaultValue() // Abort initialization if no value was stored
      )
    );

    onSet((newValue) => {
      saveObject(key, newValue);
    });
  };

const localEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    setSelf(
      getObject(key).then(
        (savedValue) => (savedValue != null ? savedValue : new DefaultValue()) // Abort initialization if no value was stored
      )
    );

    onSet((newValue) => {
      saveObject(key, newValue);
    });
  };

// const localGroupsEffect =
//   (key) =>
//   ({ setSelf, onSet }) => {
//     setSelf(
//       getObject(key).then(
//         (savedValue) => (savedValue != null ? JSON.parse(savedValue) : new DefaultValue()) // Abort initialization if no value was stored
//       )
//     );

//     onSet((newValue) => {
//       saveObject(key, JSON.stringify(newValue));
//     });
//   };

export const launcherIDsState = atom({
  key: 'atomFarms',
  default: [],
  // default: [],
  effects_UNSTABLE: [localEffect('farms')],
});

export const groupState = atom({
  key: 'groupState',
  default: [],
  effects_UNSTABLE: [localEffect('group')],
});

export const tokensState = atom({
  key: 'atomTokens',
  default: new Set(),
  effects_UNSTABLE: [localTokenEffect('tokens')],
});

export const settingsState = atom({
  key: 'atomTheme',
  default: {
    isThemeDark: false,
    sharpEdges: true,
    blockNotifications: false,
    showOnlyActiveFarmers: true,
    poolspaceDefault: 4,
    partialDefault: 4,
    priceDefault: 3,
    netspaceDefault: 3,
    intialRoute: 'Home',
  },
  effects_UNSTABLE: [localEffect('settings')],
});

export const dashboardState = atom({
  key: 'atomDashboard',
  default: {},
});

export const farmLoadingState = atom({
  key: 'atomLoadingFarm',
  default: { address: true, stats: true, partials: true, payouts: true },
});

export const farmErrorState = atom({
  key: 'atomErrorFarm',
  default: { address: false, stats: false, partials: false, payouts: false },
});

export const currencyState = atom({
  key: 'atomCurrency',
  default: 'usd',
  effects_UNSTABLE: [localEffect('currency')],
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

export const networkState = atom({
  key: 'networkStateAtom', // unique ID (with respect to other atoms/selectors)
  default: true, // default value (aka initial value)
});

export const statsRequestIDState = atomFamily({
  key: 'statsRequestAtomFamily',
  default: 0,
});

export const giveawayRequestState = atomFamily({
  key: 'giveawayRequestState',
  default: 0,
});

export const giveawayWinnersState = atomFamily({
  key: 'giveawayWinnersState',
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

export const netSpaceRequestIDState = atomFamily({
  key: 'netspaceRequestAtomFamily',
  default: 0,
});

export const farmerBlockRefreshState = atomFamily({
  key: 'farmerBlockRefreshState',
  default: 0,
});

export const farmerPayoutsRefreshState = atomFamily({
  key: 'farmerPayoutsRefreshState',
  default: 0,
});

export const ticketsRefreshState = atomFamily({
  key: 'ticketsRefreshState',
  default: 0,
});

export const farmerRefreshState = atomFamily({
  key: 'farmerRefreshState',
  default: 0,
});

export const newsRefreshState = atomFamily({
  key: 'newsRefreshState',
  default: 0,
});

export const partialRefreshState = atomFamily({
  key: 'partialRefreshState',
  default: 0,
});

export const farmerSearchBarTextState = atom({
  key: 'farmerSearchBarTextState',
  default: '',
});

export const farmerSearchBarPressedState = atom({
  key: 'farmerSearchBarPressedState',
  default: false,
});
