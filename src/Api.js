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
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });

export const getStats = () =>
  fetch(`${REST_API}stats`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((json) => json);
// .catch((error) => {
//   console.log(error);
// });

export const getFarmers = (offset, limit) =>
  fetch(`${REST_API}launcher/?limit=${limit}&offset=${offset}&is_pool_member=true`)
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

export const getFarmer = (launcherID) =>
  fetch(`${REST_API}launcher/${launcherID}`)
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

export const getBlocks = () =>
  fetch(`${REST_API}block`)
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

export const getBlocksFromFarmer = (launcherId) =>
  fetch(`${REST_API}block/?farmed_by=${launcherId}`)
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

export const getPayouts = () =>
  fetch(`${REST_API}payout`)
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

export const getPayoutsFromAddress = (launcherId) =>
  fetch(`${REST_API}payoutaddress/?launcher=${launcherId}`)
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

export const getPartialsFromID = (launcherID, timestamp) =>
  fetch(
    `${REST_API}partial/?ordering=-timestamp&min_timestamp=${timestamp.toString()}&launcher=${launcherID}&limit=900`
    // `https://openchia.io/api/v1.0/partial/?ordering=-timestamp&min_timestamp=${timestamp}&launcher=${launcherID}/?format=json`
    // `https://openchia.io/api/v1.0/partial/?limit=200&offset=200`
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
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });
