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
import { api, SPACESCAN_API } from '../services/Api';
import { encodePuzzleHash } from '../utils/bech32';
import { getObject, saveObject } from '../utils/Utils';

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

export const launcherIDsState = atom({
  key: 'atomFarms',
  default: [],
  effects_UNSTABLE: [localEffect('farms')],
});

// [
//   {
//     address: undefined,
//     customDifficulty: 'LOWEST',
//     custom_difficulty: 'LOWEST',
//     email: null,
//     launcherId: '6d50b88556ba0cbc8229e971c8c5deb49677bcfb640dd9186f8615fbe7ac68fc',
//     min_payout: 50000000000000,
//     minimum_payout: 8000000000000,
//     name: 'Voldermort',
//     payment: ['PUSH'],
//     referrer: null,
//     size_drop: [],
//     size_drop_interval: 80,
//     size_drop_percent: 34,
//     token: '1e8e6acd9456f39b599de18dde552e0a020d72b0205468d77d4e28a203ebb1ea',
//   },
// ];

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

export const dashboardSelectedState = atom({
  key: 'dashboardSelectedState',
  default: null,
});

export const balanceQuery = selectorFamily({
  key: 'BalanceQuery',
  get: (address) => async () => {
    const balance = await api({ baseURL: SPACESCAN_API, url: `/xch/balance/${address}` }).catch(
      (err) => {
        throw err;
      }
    );
    return { address, balance };
  },
});

export const statsQuery = selectorFamily({
  key: 'StatsQuery',
  get: () => async () => {
    const response = await api({ url: `stats` }).catch((err) => {
      throw err;
    });
    return response;
  },
});

export const launcherQuery = selectorFamily({
  key: 'LauncherQuery',
  get:
    ({ launcherId, token }) =>
    async () => {
      const response = await api({
        url: `launcher/${launcherId}/`,
        headers: { Authorization: `Bearer ${token}` },
      }).catch((err) => {
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

    const farms = get(
      waitForAll(
        launchderIds.map((farm) =>
          launcherQuery({ launcherId: farm.launcherId, token: farm.token })
        )
      )
    );

    if (showBalance) {
      const addressesToScan = new Set();
      farms.forEach((item) => {
        addressesToScan.add(encodePuzzleHash(item.payout_instructions, 'xch'));
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

export const currencyState = atom({
  key: 'atomCurrency',
  default: 'usd',
  effects_UNSTABLE: [localEffect('currency')],
});

export const newsRefreshState = atomFamily({
  key: 'newsRefreshState',
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
