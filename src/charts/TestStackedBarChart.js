/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-restricted-globals */
import React from 'react';
import { PanResponder, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';
import useAnimatedPath from './useAnimatedPath';
import { createPaths } from './Utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Bar = ({ color, path, itemKey, pressed, selectedPoints, points, test }) => {
  const { animatedProps } = useAnimatedPath({
    enabled: true,
    itemKey,
    pressed,
    path,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      console.log(points);
      console.log(test);
      selectedPoints.value = points;
      pressed.value = itemKey;
    },
    onPanResponderRelease: () => {
      selectedPoints.value = null;
      pressed.value = -1;
    },
  });
  return <AnimatedPath animatedProps={animatedProps} fill={color} {...panResponder.panHandlers} />;
};

const TestStackedBarChart = ({ data, height, width, keys, colors, selectedPoints }) => {
  const pressed = useSharedValue(false);

  return (
    <View height={height}>
      <Svg width={width} height={height}>
        {createPaths({ data, keys, colors, height, width }).map((bar, index) => {
          const keyIndex = index % data.length;
          const key = `${keyIndex}-${bar.key}`;
          return (
            <Bar
              key={key}
              itemKey={keyIndex}
              color={bar.color}
              // For some reason it didnt like the object I created intially
              test={bar.points}
              points={{
                failed: bar.points.failed,
                passed: bar.points.passed,
                time: { start: bar.points.time.start, end: bar.points.time.end },
              }}
              selectedPoints={selectedPoints}
              path={bar.path}
              pressed={pressed}
            />
          );
        })}
      </Svg>
    </View>
  );
};
export default TestStackedBarChart;
