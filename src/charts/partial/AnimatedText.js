/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React from 'react';
import { TextInput } from 'react-native';
import Animated, { useAnimatedProps, useDerivedValue } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedText = ({ defaultValue = '', pressed, style }) => {
  const animatedProps = useAnimatedProps(() => ({
    color: pressed ? 'red' : 'green',
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

export default AnimatedText;
