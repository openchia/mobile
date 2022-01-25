import React, { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import TouchableRipple from './TouchableRipple';

const PressableCard = ({ style, onPress, children, enabled }) => {
  const [rippleColor, setRippleColor] = useState(randomHexColor());
  const [rippleOverflow, setRippleOverflow] = useState(false);
  const theme = useTheme();
  return (
    <View
      enabled={enabled}
      // underlayColor="#fb3"
      style={[
        {
          backgroundColor: theme.colors.onSurface,
          // borderColor: theme.colors.borderColor,
          borderRadius: 8,
          // borderWidth: 2,
          // shadowColor: '#000',
          // shadowRadius: 10,
          // overflow: 'hidden',
          // shadowOpacity: 1,
          // elevation: 2,
          // shadowOffset: { width: 0, height: 1 },
        },
        style,
      ]}
      // onPress={onPress}
    >
      <TouchableNativeFeedback
        onPress={() => {
          console.log('Called');
          setRippleColor(randomHexColor());
          setRippleOverflow(!rippleOverflow);
        }}
        background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)}
      >
        <View>{children}</View>
      </TouchableNativeFeedback>
    </View>
  );
};

const randomHexColor = () => {
  return '#000000'.replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
};

export default PressableCard;
