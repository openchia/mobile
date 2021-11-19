/* eslint-disable no-restricted-globals */
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as scale from 'd3-scale';
import { Text } from 'react-native-paper';
import { Svg, Rect, Path } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { mixPath } from 'react-native-redash';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const TestStackedBarChart = ({ data, height, keys, colors }) => {
  const { width } = useWindowDimensions();
  const spacingInner = 0.05;
  const spacingOuter = 0.05;
  const previous = useSharedValue(0);
  const current = useSharedValue(0);
  const transition = useSharedValue(0);

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

  return (
    <View height={height}>
      <Svg height={height} width={width}>
        {areas.map((bar, index) => {
          const keyIndex = index % data.length;
          const key = `${keyIndex}-${bar.key}`;
          const { svg } = data[keyIndex][bar.key];

          return (
            // <AnimatedPath
            //   animatedProps={animatedProps}
            //   {...svg}
            //   fill={bar.color}
            //   // stroke="black"
            //   // strokeWidth={3}
            // />
            <Path key={key} fill={bar.color} {...svg} d={bar.path} />
          );
        })}
      </Svg>
    </View>
  );
};

export default TestStackedBarChart;
