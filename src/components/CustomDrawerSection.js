/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Divider, Text, withTheme } from 'react-native-paper';

const CustomDrawerSection = ({ children, title, theme, style, showDivider, ...rest }) => {
  const { colors, fonts } = theme;
  // const titleColor = color('grey').alpha(0.7).rgb().string();
  const titleColor = 'grey';
  const font = fonts.medium;

  return (
    <View style={[styles.container, style]} {...rest}>
      {title && (
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={[{ color: titleColor, ...font }, styles.title]}>
            {title}
          </Text>
        </View>
      )}
      {children}
      {showDivider && <Divider style={styles.divider} />}
      {/* <Divider style={styles.divider} /> */}
    </View>
  );
};

CustomDrawerSection.displayName = 'Drawer.Section';

CustomDrawerSection.defaultProps = {
  showDivider: true,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center',
  },
  title: {
    marginLeft: 16,
  },
  divider: {
    backgroundColor: 'black',
    marginTop: 4,
  },
});

export default withTheme(CustomDrawerSection);
