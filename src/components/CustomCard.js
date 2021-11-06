import React, { useState } from 'react';

import { StyleSheet, View, TouchableNativeFeedback } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';

const CustomCard = ({ onPress, children, style }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.onSurface,
          borderColor: theme.colors.borderColor,
          marginVertical: 8,
          borderRadius: 8,
          marginHorizontal: 8,
          borderWidth: 1,
          shadowColor: '#000',
          shadowRadius: 10,
          shadowOpacity: 1,
          elevation: 6,
          // flex: 1,
          // display: dontFlex ? 'none' : 'flex',
        },
        style,
      ]}
    >
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('rgba(219, 219, 219, 0.6)', true)}
      >
        {/* {React.Children.only(children)} */}
        <>{children}</>
      </TouchableNativeFeedback>
    </View>
  );
};

export default CustomCard;
