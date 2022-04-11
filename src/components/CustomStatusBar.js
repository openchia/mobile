import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';

const CustomStatusBar = () => {
  const theme = useTheme();
  const { top: safeAreaTop } = useSafeArea();
  return (
    <View
      style={{ height: safeAreaTop, width: '100%', backgroundColor: theme.colors.statusBarColor }}
    />
  );
};

export default CustomStatusBar;
