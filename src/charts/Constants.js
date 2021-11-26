/* eslint-disable import/prefer-default-export */
export const NetspaceChartIntervals = [
  { time: 8, value: 0, label: '8h' },
  { time: 24, value: 1, label: '24h' },
  { time: 24 * 3, value: 2, label: '3d' },
  { time: 24 * 7, value: 3, label: '7d' },
  { time: 24 * 30, value: 4, label: '30d' },
  { time: 24 * 90, value: 5, label: '90d' },
  { time: -1, value: 6, label: 'All' },
];

export const PartChartIntervals = [
  { time: 4, interval: 1, label: '4h' },
  { time: 6, interval: 1, label: '6h' },
  { time: 8, interval: 1, label: '8h' },
  { time: 12, interval: 1, label: '12h' },
  { time: 24, interval: 2, label: '24h' },
  { time: 24 * 2, interval: 4, label: '2d' },
  { time: 24 * 3, interval: 6, label: '3d' },
  // { time: -1, value: 6, label: 'All' },
];
