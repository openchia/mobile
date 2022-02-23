import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  waitForAll,
  waitForAllSettled,
  waitForAny,
} from 'recoil';
import { apiGet, apiSpaceScanGet } from '../services/Api';
import { getObject, saveObject } from '../utils/Utils';

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
 // default: [],
  default: [
    {
      address: 'xch13v9r3wkceh6h5juecgzcfyf5x6ll9p2ehh03m2z46qyrdutp258qy4zu42',
      launcherId: '5f4e8bfa239609ac9198d69f03e81db9eb1c584114608f886d6db759184aa634',
      name: '🐟 Happy Fish   🐟',
      token: 'd950d662579c124cc75cd6ba2e88ca04f397447e4722db0ffeeba16c7e248afc',
    },
  ],
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
    showBalance: false,
  },
  effects_UNSTABLE: [localEffect('settings')],
});

// export const dashboardState = atom({
//   key: 'atomDashboard',
//   default: {},
// });

export const dashboardSelectedState = atom({
  key: 'dashboardSelectedState',
  default: null,
});

// export const dashboardState = selector({
//   key: 'dashboardState',
//   get: ({ get }) => {
//     const farms = get(launcherIDsState);
//     const selected = get(dashboardSelectedState);
//     const isSingle = farms.length === 1;
//     if (isSingle) {
//       return { farm: farms[0], isSingle: true };
//     }
//     if (selected) {
//       return {
//         farm: farms.find((item) => item.launcherId === selected.launcherId),
//         isSingle: false,
//         selected: true,
//       };
//     }
//     return { farms, isSingle: false, selected: false };
//   },
// });

export const balanceQuery = selectorFamily({
  key: 'BalanceQuery',
  get: (address) => async () => {
    const balance = await apiSpaceScanGet(`/xch/balance/${address}`).catch((err) => {
      throw err;
    });
    return { address, balance };
  },
});

export const statsQuery = selectorFamily({
  key: 'StatsQuery',
  get: () => async () => {
    const response = await apiGet(`stats`).catch((err) => {
      console.log('Called');
      throw err;
    });
    return response;
  },
});

export const launcherQuery = selectorFamily({
  key: 'LauncherQuery',
  get: (launcherId) => async () => {
    const response = await apiGet(`launcher/${launcherId}/`).catch((err) => {
      throw err;
    });
    return response;
  },
});

export const dashboardState = selector({
  key: 'Dashboard',
  get: ({ get }) => {
    const selected = get(dashboardSelectedState);
    const { showBalance } = get(settingsState);
    const launchderIds = get(launcherIDsState);
    const stats = get(statsQuery());

    const farms = get(waitForAll(launchderIds.map((farm) => launcherQuery(farm.launcherId))));

    if (showBalance) {
      const addressesToScan = new Set();
      const balanceLauncherIds = [];
      launchderIds.forEach((item) => {
        if (item.token !== null) {
          addressesToScan.add(item.address);
          balanceLauncherIds.push(item.launcherId);
        }
      });
      const balances = get(
        waitForAll(Array.from(addressesToScan).map((address) => balanceQuery(address)))
      );

      return {
        stats,
        balances: selected
          ? balances.filter((farm) => farm.address === selected.address)
          : balances,
        farms: selected ? farms.filter((farm) => farm.launcher_id === selected.launcherId) : farms,
        selected,
      };
    }
    return {
      stats,
      farms: selected ? farms.filter((farm) => farm.launcher_id === selected.launcherId) : farms,
      selected,
    };
  },
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
