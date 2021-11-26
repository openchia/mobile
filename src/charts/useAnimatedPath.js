import { useEffect, useRef } from 'react';
import {
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { interpolatePath } from './interpolatePath.ts';

const usePrevious = (value) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

export default function useAnimatedPath({ enabled = true, path, pressed, itemKey }) {
  const transition = useSharedValue(0);

  const previousPath = usePrevious(path);

  useAnimatedReaction(
    () => path,
    (_, previous) => {
      if (previous) {
        transition.value = 0;
        transition.value = withTiming(1);
      }
    },
    [path]
  );

  const animatedProps = useAnimatedProps(() => {
    let d = path || '';
    if (previousPath && enabled) {
      const pathInterpolator = interpolatePath(previousPath, path, null);
      d = pathInterpolator(transition.value);
    }
    return {
      opacity: pressed.value === itemKey ? 0.6 : 1,
      d,
    };
  });

  return { animatedProps };
}
