/* eslint-disable react/react-in-jsx-scope */
import * as shape from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { Dimensions } from 'react-native';
import { parse } from 'react-native-redash';

import data from './data.json';

export const SIZE = Dimensions.get('window').width;

const buildGraph = (data) => {
  const { width } = useWindowDimensions();
  const spacingInner = 0.05;
  const spacingOuter = 0.05;

  const valueAccessor = ({ item, key }) => item[key];

  const series = shape
    .stack()
    .keys(keys)
    .order(shape.stackOrderNone)
    .value((item, key) => valueAccessor({ item, key }))
    .offset(shape.stackOffsetNone)(data);

  const values = array.merge(array.merge(series));
  const indexes = values.map((_, index) => index);

  const extent = array.extent([...values, 0, height]);

  const y = scale.scaleLinear().domain(extent).range([height, 0]);
  const x = scale
    .scaleBand()
    .domain(data.map((_, index) => index))
    .range([0, width])
    .paddingInner([spacingInner])
    .paddingOuter([spacingOuter]);

  const bandwidth = x.bandwidth();

  const areas = array.merge(
    series.map((serie, keyIndex) =>
      serie.map((entry, entryIndex) => {
        const path = shape
          .area()
          .y0((d) => y(d[0]))
          .y1((d) => y(d[1]))
          .x((d, _index) => (_index === 0 ? x(entryIndex) : x(entryIndex) + x.bandwidth()))
          .defined((d) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry]);

        return {
          path,
          color: colors[keyIndex],
          key: keys[keyIndex],
        };
      })
    )
  );
  return {
    // label,
    // minPrice,
    // maxPrice,
    // percentChange: datapoints.percent_change,
    path: areas.map((bar, index) => {
      const keyIndex = index % data.length;
      const key = `${keyIndex}-${bar.key}`;
      const { svg } = data[keyIndex][bar.key];

      return parse(bar.path);
    }),
  };
};

export const graphs = [
  {
    label: '1H',
    value: 0,
    data: buildGraph(values.hour, 'Last Hour'),
  },
  {
    label: '1D',
    value: 1,
    data: buildGraph(values.day, 'Today'),
  },
  {
    label: '1M',
    value: 2,
    data: buildGraph(values.month, 'Last Month'),
  },
  {
    label: '1Y',
    value: 3,
    data: buildGraph(values.year, 'This Year'),
  },
  {
    label: 'all',
    value: 4,
    data: buildGraph(values.all, 'All time'),
  },
];
