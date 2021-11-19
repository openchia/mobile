import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as scale from 'd3-scale';
import { Text } from 'react-native-paper';
import { Svg, Rect, Path } from 'react-native-svg';

const TestStackedBarChart = ({ data, height, keys, colors }) => {
  const { width } = useWindowDimensions();

  const series = shape.stack().keys(keys).order(shape.stackOrderNone).offset(shape.stackOffsetNone)(
    data
  );

  const xAccessor = ({ index }) => index;

  // double merge arrays to extract just the yValues
  const yValues = array.merge(array.merge(series));
  const xValues = data.map((item, index) => xAccessor({ item, index }));

  const yExtent = array.extent([...yValues, 0, height]);
  const xExtent = array.extent(xValues);

  const yMin = yExtent[0];
  const yMax = yExtent[1];
  const xMin = xExtent[0];
  const xMax = xExtent[1];

  const y = scale.scaleLinear().domain([yMin, yMax]).range([height, 0]).clamp(true);

  const x = scale.scaleLinear().domain([xMin, xMax]).range([0, width]).clamp(true);

  const areas = series.map((serie, index) => {
    const path = shape
      .area()
      .x((d, index) => x(xAccessor({ item: d.data, index })))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(shape.curveLinear)(data.map((_, index) => serie[index]));

    return {
      path,
      key: keys[index],
      color: colors[index],
    };
  });
  return (
    <View height={height}>
      <Svg height={height} width={width}>
        {areas.map((area, index) => (
          <Path
            key={area.key}
            // fill="red"
            fill={area.color}
            // {...svgs[index]}
            // animate={animate}
            // animationDuration={animationDuration}
            d={area.path}
          />
        ))}
      </Svg>
    </View>
  );
};

export default TestStackedBarChart;
