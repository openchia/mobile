import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple, withTheme } from 'react-native-paper';

const CustomIconButton = ({
  icon,
  color: customColor,
  size = 24,
  accessibilityLabel,
  disabled,
  onPress,
  animated = false,
  theme,
  style,
  ...rest
}) => {
  const iconColor = typeof customColor !== 'undefined' ? customColor : theme.colors.text;
  // const rippleColor = color(iconColor).alpha(0.32).rgb().string();
  const rippleColor = theme.colors.textGreyLight;
  const buttonSize = size * 1.5;
  return (
    <TouchableRipple
      borderless
      centered
      onPress={onPress}
      rippleColor={rippleColor}
      style={[
        styles.container,
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        disabled && styles.disabled,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
      accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
      accessibilityComponentType="button"
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={
        TouchableRipple.supported
          ? { top: 10, left: 10, bottom: 10, right: 10 }
          : { top: 6, left: 6, bottom: 6, right: 6 }
      }
      {...rest}
    >
      <View>{icon}</View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: 6,
  },
  disabled: {
    opacity: 0.32,
  },
});

export default withTheme(CustomIconButton);
