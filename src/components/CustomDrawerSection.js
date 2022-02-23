/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, withTheme } from 'react-native-paper';

const CustomDrawerSection = ({ children, title, theme, style, showDivider, ...rest }) => {
  const { colors, fonts } = theme;
  const font = fonts.medium;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]} {...rest}>
      {title && (
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={[{ color: colors.textGrey, ...font }, styles.title]}>
            {title}
          </Text>
        </View>
      )}
      {children}
      {/* <View style={{ height: 6 }} /> */}
      {showDivider && <Divider style={{ backgroundColor: colors.divider }} />}
    </View>
  );
};

CustomDrawerSection.displayName = 'Drawer.Section';

CustomDrawerSection.defaultProps = {
  showDivider: true,
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 4,
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
    // marginTop: 4,
  },
});

export default withTheme(CustomDrawerSection);
