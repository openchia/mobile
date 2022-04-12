/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as scale from 'd3-scale';

export const createPaths = ({ data, keys, colors, height, width }) => {
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

  const extent = array.extent([...values, 0, 0]);

  const y = scale.scaleLinear().domain(extent).range([height, 0]);
  const x = scale
    .scaleBand()
    .domain(data.map((_, index) => index))
    .range([0, width])
    .paddingInner([spacingInner])
    .paddingOuter([spacingOuter]);

  const test = array.merge(
    series.map((serie, keyIndex) =>
      serie.map((entry, entryIndex) => {
        const path = shape
          .area()
          .y0((d) => y(d[0]))
          .y1((d) => y(d[1]))
          .x((d, _index) => (_index === 0 ? x(entryIndex) : x(entryIndex) + x.bandwidth()))
          .defined((d) => !isNaN(d[0]) && !isNaN(d[1]))([entry, entry]);

        return {
          points: data[entryIndex],
          path,
          color: colors[keyIndex],
          key: keys[keyIndex],
        };
      })
    )
  );
  return test;
};
