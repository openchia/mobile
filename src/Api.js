import axios from 'axios';

const REST_API = 'https://openchia.io/api/v1.0/';

export const getNetspace = () =>
  fetch(`${REST_API}space`)
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
      throw Error(response.statusText);
    })
    .then((json) => json)
    .catch((error) => {
      console.log(error);
    });

export const getFarmers = () =>
  fetch(`${REST_API}launcher`)
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
