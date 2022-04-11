//AnimatedText.js

import * as React from 'react';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedText = ({ text }) => {
  const theme = useTheme();
  const animatedProps = useAnimatedProps(() => ({
    text: text.value,
  }));

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={text.value}
      animatedProps={animatedProps}
      style={{ color: theme.colors.text, textAlign: 'center' }}
    />
  );
};

export default AnimatedText;
