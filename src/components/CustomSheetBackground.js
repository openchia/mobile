import React, { useMemo } from 'react';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';

const CustomSheetBackground = ({ style, animatedIndex }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(animatedIndex.value, [0, 1], ['#ffffff', '#a8b5eb']),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomSheetBackground;
