// useOrientation.tsx
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

/**
 * A React Hook which updates when the orientation changes
 * @returns whether the user is in 'PORTRAIT' or 'LANDSCAPE'
 */
const useOrientation = () => {
  // State to hold the connection status
  const [orientation, setOrientation] = useState(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');

  useEffect(() => {
    const callback = () => setOrientation(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');

    const susbcription = Dimensions.addEventListener('change', callback);

    return () => {
      susbcription.remove();
    };
  }, []);

  return orientation;
};

export default useOrientation;
