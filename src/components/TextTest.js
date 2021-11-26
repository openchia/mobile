/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useContext } from 'react';
import { TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const TestLabel = ({ defaultValue = '', interval, format, selectedPoints, style, type }) => {
  const formattedValue = useDerivedValue(
    () =>
      selectedPoints.value
        ? format
          ? `${format(selectedPoints.value[type], interval)}`
          : selectedPoints.value[type].toString()
        : null,
    [defaultValue]
  );

  const animatedProps = useAnimatedProps(() => ({
    text: formattedValue.value ? formattedValue.value : defaultValue,
  }));

  return (
    <AnimatedTextInput
      {...{ animatedProps }}
      defaultValue={defaultValue.toString()}
      value={defaultValue.toString()}
      style={[
        {
          padding: 0,
          margin: 0,
        },
        style,
      ]}
      editable={false}
    />
  );
};

export default TestLabel;
