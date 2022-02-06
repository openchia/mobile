import axios from 'axios';

const REST_API = 'https://openchia.io/api/v1.0/';
const CHIA_PLOT_REST_API = 'https://thechiaplot.net/wp-json/wp/v2/';
const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

const openChiaApi = axios.create({
  baseURL: 'https://openchia.io/api/v1.0/',
  timeout: 1000,
});

const spaceScanApi = axios.create({
  baseURL: 'https://api2.spacescan.io/1/',
  timeout: 1000,
});

export const getAddressBalance = async (address, launcherId) => {
  const url = `/xch/balance/${address}`;
  return spaceScanApi
    .get(url)
    .then((res) => ({ value: res.data.data.unspentBalance, launcherId }))
    .catch((err) => {
      console.log('getAddressBalance axios Error', err);
    });
};

export const getPayoutAddress = async (launcherId) => {
  const url = `/payoutaddress/?launcher=${launcherId}&limit=1`;
  return openChiaApi
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      console.log('getAddressBalance axios Error', err);
    });
};

export const getNetspace = (days) => {
  const url = `/xch/netspace/${days}`;
  return spaceScanApi
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      console.log('getAddressBalance axios Error', err);
    });
};

export const getSpace = (days) =>
  fetch(`${REST_API}space?days=${days}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

// export const getSpace = () =>
//   fetch(`${REST_API}space?days=365`)
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw Error(response.statusText);
//     })
//     .then((json) => json);

export const getStats = () =>
  fetch(`${REST_API}stats`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((json) => json);

export const getFarmers = (offset, limit, search, showOnlyActiveFarmers) =>
  fetch(
    `${REST_API}launcher/?limit=${limit}&${
      showOnlyActiveFarmers ? 'points_pplns__gt=0' : ''
    }&offset=${offset}&is_pool_member=true&search=${search}&ordering=-points_pplns`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getFarmersFromLauncherID = (launcherIDs) => {
  const promises = launcherIDs.map((launcherId) => getFarmer(launcherId));
  return Promise.all(promises);
};

export const getFarmerStats = (launcherId) => {
  const promises = [getFarmer(launcherId), getStats()];
  return Promise.all(promises);
};

export const getFarmersFromLauncherIDAndStats = (launcherIDs) => {
  const promises = [getFarmersFromLauncherID(launcherIDs), getStats()];
  return Promise.all(promises);
};

export const getBalanceFromAddresses = (addresses, launcherIds) => {
  const promises = addresses.map((addresses, index) =>
    getAddressBalance(addresses, launcherIds[index])
  );
  return Promise.all(promises);
};

export const getFarmer = (launcherID) =>
  fetch(`${REST_API}launcher/${launcherID}/`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getBlocks = (offset, limit) =>
  fetch(`${REST_API}block/?limit=${limit}&offset=${offset}&`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getBlocksFromFarmer = (launcherId, offset, limit) =>
  fetch(`${REST_API}block/?farmed_by=${launcherId}&limit=${limit}&offset=${offset}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getBlocksFromFarmers = (launcherIDs) => {
  const promises = launcherIDs.map((launcherId) => getBlocksFromFarmer(launcherId));
  return Promise.all(promises);
};

export const getPayouts = (offset, limit) =>
  fetch(`${REST_API}payout/?limit=${limit}&offset=${offset}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);
// export const getPayouts = () =>
//   fetch(`${REST_API}payout`)
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw Error(response.statusText);
//     })
//     .then((json) => json);

export const getPayoutsFromAddress = (launcherId, offset, limit) =>
  fetch(`${REST_API}payoutaddress/?launcher=${launcherId}&limit=${limit}&offset=${offset}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getPayoutsFromAddresses = (launcherIDs, offset, limit) => {
  const promises = launcherIDs.map((launcherId) =>
    getPayoutsFromAddress(launcherId, offset, limit)
  );
  return Promise.all(promises);
};

export async function getPartialsFromID(launcherId, timestamp) {
  const url = `partial/?ordering=-timestamp&min_timestamp=${timestamp.toString()}&launcher=${launcherId}&limit=2000`;
  return openChiaApi
    .get(url)
    .then((res) => ({ launcherId, data: res.data.results }))
    .catch((err) => {
      console.log('getPartialsFromID axios Error', err);
    });
}

export const getPartialsFromIDs = (launcherIDs, timestamp) => {
  const promises = launcherIDs.map((launcherId) => getPartialsFromID(launcherId, timestamp));
  return Promise.all(promises);
};

export const getPartialsFromIDsChart = (launcherIDs, timestamp) => {
  const promises = launcherIDs.map((launcherId) => getPartialsFromIDTest(launcherId, timestamp));
  return Promise.all(promises);
};
// export const getPartialsFromID = (launcherID, timestamp) =>
//   fetch(
//     `${REST_API}partial/?ordering=-timestamp&min_timestamp=${timestamp.toString()}&launcher=${launcherID}&limit=900`
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw Error(response.statusText);
//     })
//     .then((json) => json);

export const getPartialsFromIDTest = (launcherID, timestamp) =>
  fetch(
    `${REST_API}partial/?ordering=-timestamp&min_timestamp=${timestamp.toString()}&launcher=${launcherID}&limit=2000`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });

export const getChiaPlotPosts = () =>
  fetch(`${CHIA_PLOT_REST_API}posts`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getTickets = (launcherID) => {
  return fetch(`${REST_API}giveaway/tickets/?ordering=-created_at&launcher=${launcherID}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);
};

export const getTicketsFromLauncherIds = (launcherIDs) => {
  const promises = launcherIDs.map((launcherId) => getTickets(launcherId));
  return Promise.all(promises);
};

export const getRound = () =>
  fetch(`${REST_API}giveaway/round/`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

// export const getMarketChart = (currency, days, interval) => {
//   console.log(
//     `${COINGECKO_API}coins/chia/market_chart?vs_currency=${currency}&days=${
//       days || 'max'
//     }&interval=${interval || 1}`
//   );
//   return axios
//     .get(
//       `${COINGECKO_API}coins/chia/market_chart?vs_currency=${currency}&days=${
//         days || 'max'
//       }&interval=${interval || 1}`
//     )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw Error(response.statusText);
//     })
//     .then((json) => json);
// };

export const getMarketChart = async (currency, days, interval) => {
  try {
    return await axios.get(
      `${COINGECKO_API}coins/chia/market_chart?vs_currency=${currency}&days=${
        days || 'max'
      }&interval=${interval || 1}`
    );
  } catch (error) {
    console.error(error);
  }
};

export const getLauncherIDFromToken = (token) =>
  fetch(`${REST_API}login_qr`, {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });

export const updateFCMToken = (launcherID, token, FCMToken) =>
  fetch(`${REST_API}launcher/${launcherID}/`, {
    method: 'PUT',
    body: JSON.stringify({
      fcm_token: FCMToken,
    }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });

export const updateFarmerName = (launcherID, token, name) =>
  fetch(`${REST_API}launcher/${launcherID}/`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
    }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);
// .catch((error) => {
//   console.log(error);
// });

export const updateFarmerBlockNotification = (launcherID, token, enabled) =>
  fetch(`${REST_API}launcher/${launcherID}/`, {
    method: 'PUT',
    body: JSON.stringify({
      push_block_farmed: enabled,
    }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });

export const updateFarmerMissingPartialsNotification = (launcherID, token, enabled) =>
  fetch(`${REST_API}launcher/${launcherID}/`, {
    method: 'PUT',
    body: JSON.stringify({
      push_missing_partials_hours: enabled,
    }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });
