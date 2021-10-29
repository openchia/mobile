import axios from 'axios';

const url = 'https://openchia.io/api/v1.0/';

export const getNetspace = () =>
  fetch(`https://openchia.io/api/v1.0/space?format=json`)
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
  fetch(`https://openchia.io/api/v1.0/stats?format=json`)
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
  fetch(`https://openchia.io/api/v1.0/launcher?format=json`)
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
  fetch(`https://openchia.io/api/v1.0/block/?format=json`)
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
  fetch(`https://openchia.io/api/v1.0/payout/?format=json`)
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
