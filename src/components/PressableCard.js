import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import TouchableRipple from './TouchableRipple';

const PressableCard = ({ style, onPress, children, enabled }) => {
  const theme = useTheme();
  return (
    <TouchableRipple
      enabled={enabled}
      style={[
        {
          backgroundColor: theme.colors.onSurface,
          borderColor: theme.colors.borderColor,
          // borderColor: 'grey',
          borderRadius: 8,
          borderWidth: 1,
          shadowColor: '#000',
          shadowRadius: 10,
          overflow: 'hidden',
          shadowOpacity: 1,
          // elevation: 6,
          // shadowOffset: { width: 0, height: 1 },
        },
        style,
      ]}
      onPress={onPress}
    >
      <>{children}</>
    </TouchableRipple>
  );
};

export default PressableCard;
