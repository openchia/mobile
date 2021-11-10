import React, { useContext } from 'react';
import { TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';

import ChartContext from '../../helpers/ChartContext';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ChartLabelFactory(style) {
  return function ChartLabel({ defaultValue = '', format, ...props }) {
    const { [style]: val = 0 } = useContext(ChartContext);
    // console.log(val);
    const formattedValue = useDerivedValue(
      // eslint-disable-next-line no-nested-ternary
      () => (val.value ? (format ? `${format(val.value)}` : val.value) : defaultValue),
      []
    );
    const textProps = useAnimatedStyle(
      () => ({
        text: formattedValue.value,
      }),
      []
    );
    // if (!val.value) return <Text style={{ color: 'black' }}>Hello</Text>;
    return (
      <AnimatedTextInput
        {...props}
        animatedProps={textProps}
        defaultValue={format ? format(val.value) : val.value}
        editable={false}
      />
    );
  };
}

export const ChartYLabel = ChartLabelFactory('originalY');
export const ChartXLabel = ChartLabelFactory('originalX');
