import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

const CustomCard = ({ style, children }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.onSurface,
          borderColor: theme.colors.borderColor,
          // marginVertical: 2,
          borderRadius: 8,
          // marginHorizontal: 4,
          borderWidth: 1,
          shadowColor: '#000',
          shadowRadius: 10,
          overflow: 'hidden',
          shadowOpacity: 1,
          // elevation: 4,
          // shadowOffset: { width: 0, height: 1 },
        },
        style,
      ]}
    >
      <>{children}</>
    </View>
  );
};

export default CustomCard;
