import React, { useState } from 'react';

import { StyleSheet, View, TouchableNativeFeedback } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';

const CustomCard = ({ title, subtitle, desc, onPress, children, selected }) => {
  const x = 0;
  return (
    <View style={[styles.content]}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('rgba(219, 219, 219, 0.6)', true)}
      >
        <View style={styles.item}>{children}</View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 6,
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});

export default CustomCard;
