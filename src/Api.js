import axios from 'axios';

const REST_API = 'https://openchia.io/api/v1.0/';
const CHIA_PLOT_REST_API = 'https://thechiaplot.net/wp-json/wp/v2/';

export const getSpace = () =>
  fetch(`${REST_API}space?days=365`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getStats = () =>
  fetch(`${REST_API}stats`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((json) => json);

export const getFarmers = (offset, limit) =>
  fetch(`${REST_API}launcher/?limit=${limit}&offset=${offset}&is_pool_member=true`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getFarmer = (launcherID) =>
  fetch(`${REST_API}launcher/${launcherID}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getBlocks = () =>
  fetch(`${REST_API}block`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getBlocksFromFarmer = (launcherId) =>
  fetch(`${REST_API}block/?farmed_by=${launcherId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getPayouts = () =>
  fetch(`${REST_API}payout`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getPayoutsFromAddress = (launcherId) =>
  fetch(`${REST_API}payoutaddress/?launcher=${launcherId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

export const getPartialsFromID = (launcherID, timestamp) =>
  fetch(
    `${REST_API}partial/?ordering=-timestamp&min_timestamp=${timestamp.toString()}&launcher=${launcherID}&limit=900`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((json) => json);

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
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });
