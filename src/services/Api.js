/* eslint-disable arrow-body-style */
/* eslint-disable no-undef */
import axios from 'axios';

export const CHIA_PLOT_REST_API = 'https://thechiaplot.net/wp-json/wp/v2/';
export const OPENCHIA_API = 'https://openchia.io/api/v1.0/';
export const OPENCHIA_API_TESTNET = 'https://testnet.openchia.io/api/v1.0/';
export const SPACESCAN_API = 'https://api2.spacescan.io/1/';
export const COINGECKO_API = 'https://api.coingecko.com/api/v3/';

export const api = (request, signal) => {
  return axios({
    method: request.method ? request.method : 'get',
    baseURL: request.baseURL ? request.baseURL : OPENCHIA_API,
    url: request.url,
    data: request.body,
    headers: request.headers,
    signal,
  })
    .then((response) => {
      if (response) {
        return response.data;
      }
      throw new Error(response.statusText);
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Caught Cancel');
      } else {
        throw err;
      }
    });
};

export const apiMulti = (urls, signal) => {
  const promises = urls.map((url) => {
    return api({ url }, signal);
  });
  return Promise.all(promises);
};
