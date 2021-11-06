export const roundNumber = (num, scale) => {
  if (!`${num}`.includes('e')) {
    return +`${Math.round(`${num}e+${scale}`)}e-${scale}`;
  }
  const arr = `${num}`.split('e');
  let sig = '';
  if (+arr[1] + scale > 0) {
    sig = '+';
  }
  return +`${Math.round(`${+arr[0]}e${sig}${+arr[1] + scale}`)}e-${scale}`;
};

export const formatBytes = (bytes) => {
  const sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  if (bytes == 0) return '';
  if (bytes == 1) return '1 byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${i == 0 ? bytes / Math.pow(1024, i) : roundNumber(bytes / Math.pow(1024, i), 2)} ${
    sizes[i]
  }`; // .round
};

export const currencyFormat = (value) => value;
// new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'usd',
// }).format(value);

export const convertSecondsToHourMin = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

export const convertMojoToChia = (mojo) => mojo / 10 ** 12;

export const formatPrice = (price, currency) => {
  const currencyOptions = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).resolvedOptions();

  const value = price.toLocaleString('en-US', {
    ...currencyOptions,
    style: 'decimal',
  });
  return value;
};
