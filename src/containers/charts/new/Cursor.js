import {
  Circle,
  Group,
  runSpring,
  Shadow,
  Skia,
  useComputedValue,
  useValue,
  useValueEffect,
} from '@shopify/react-native-skia';
import React from 'react';

const Cursor = ({ x, y, color, gestureActive, pathEnd }) => {
  const circleRadius = useValue(0);
  const circleStrokeRadius = useComputedValue(() => circleRadius.current * 6, [circleRadius]);
  const transform = useComputedValue(
    () => [{ translateX: x.current }, { translateY: y.current }],
    [x, y]
  );

  useValueEffect(gestureActive, () => {
    runSpring(circleRadius, gestureActive.current ? 5 : 0, {
      mass: 1,
      stiffness: 1000,
      damping: 50,
      velocity: 0,
    });
    if (!gestureActive.current) pathEnd.current = 1;
  });
  return (
    <Group transform={transform}>
      <Circle cx={0} cy={0} r={circleStrokeRadius} color="#000000" opacity={0.03} />
      <Circle cx={0} cy={0} r={circleRadius} color={color}>
        <Shadow dx={0} dy={0} blur={3} color="#828282" />
      </Circle>
    </Group>
  );
};

export default Cursor;
