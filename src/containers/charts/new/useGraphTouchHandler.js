/* eslint-disable import/prefer-default-export */
import {
  add,
  clamp,
  dist,
  runDecay,
  runSpring,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import HapticFeedback from 'react-native-haptic-feedback';

export const useGraphTouchHandler = (x, y, xMax, width, margin, gestureActive, pathEnd) => {
  const onTouch = useTouchHandler({
    onStart: (pos) => {
      HapticFeedback.trigger('impactHeavy');
      gestureActive.current = true;
      const xPos = clamp(pos.x - margin.left, 0, xMax);
      x.current = xPos;
    },
    onActive: (pos) => {
      if (gestureActive.current) {
        const xPos = clamp(pos.x - margin.left, 0.2, xMax);
        x.current = xPos;
        pathEnd.current = xPos / width;
      }
    },
    onEnd: () => {
      gestureActive.current = false;
    },
  });
  return onTouch;
};
