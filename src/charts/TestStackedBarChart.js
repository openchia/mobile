/* eslint-disable no-restricted-globals */
import React from 'react';
import { View } from 'react-native';
import { LongPressGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue } from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';
import useAnimatedPath from './useAnimatedPath';
import { createPaths } from './Utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Bar = ({ color, path, itemKey, points, pressed, selectedPoints }) => {
  const { animatedProps } = useAnimatedPath({
    enabled: true,
    itemKey,
    pressed,
    path,
  });

  const eventHandler = useAnimatedGestureHandler({
    onActive: (event, ctx) => {
      console.log('active');
    },
    onStart: (event, ctx) => {
      selectedPoints.value = points;
      pressed.value = itemKey;
    },

    onFinish: (event, ctx) => {
      selectedPoints.value = null;
      pressed.value = -1;
    },
  });

  return (
    <LongPressGestureHandler
      enabled
      maxDist={100000}
      minDurationMs={0}
      shouldCancelWhenOutside={false}
      {...{ onGestureEvent: eventHandler }}
    >
      <AnimatedPath animatedProps={animatedProps} fill={color} />
    </LongPressGestureHandler>
  );
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
              selectedPoints={selectedPoints}
              color={bar.color}
              points={bar.points}
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
