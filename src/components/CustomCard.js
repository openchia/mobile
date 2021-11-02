import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';

const CustomCard = ({ title, subtitle, desc, onPress }) => {
  const x = 0;
  return (
    //   const theme = useTheme();
    // <View style={styles.item}>
    <TouchableRipple style={styles.item} borderless onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        {desc && <Text style={styles.desc}>{desc}</Text>}
      </View>
      {/* <Text style={styles.size}>{formatBytes(item.estimated_size)}</Text> */}
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 14,
    paddingEnd: 20,
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
  content: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
  },
  desc: {
    fontSize: 12,
  },
});

export default CustomCard;
