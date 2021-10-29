import React, { Suspense, useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import { selectorFamily, useRecoilValue } from 'recoil';
import { format, fromUnixTime } from 'date-fns';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getBlocks, getNetspace } from '../Api';
import { formatBytes } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';

const query = selectorFamily({
  key: 'farmersSelector',
  get: () => async () => {
    const response = await getBlocks();
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const Item = ({ item }) => (
  <View style={styles.item}>
    <View style={{ marginEnd: 20 }}>
      <Text style={styles.index}>{item.confirmed_block_index}</Text>
      <Text style={styles.date}>{format(fromUnixTime(item.timestamp), 'PPpp')}</Text>
    </View>
    {/* <Text style={styles.luck}>{`${item.luck}%`}</Text> */}
    <Text numberOfLines={1} style={styles.name}>
      {item.farmed_by.name ? item.farmed_by.name : item.farmed_by.launcher_id}
    </Text>
  </View>
);

const Content = ({ navigation }) => {
  const blocks = useRecoilValue(query());

  const renderItem = ({ item, index }) => <Item item={item} />;

  return (
    <SafeAreaView>
      <FlatList
        data={blocks.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.name.toString()}
      />
    </SafeAreaView>
  );
};

const BlocksFoundScreen = ({ navigation }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content />
  </Suspense>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  index: {
    fontSize: 14,
    marginEnd: 20,
  },
  date: {
    fontSize: 10,
    marginEnd: 20,
  },
  name: {
    fontSize: 14,
    color: '#407538',
    marginLeft: 'auto',
    textAlign: 'right',
    flex: 1,
  },
  luck: {
    fontSize: 14,
    marginEnd: 20,
  },
});

export default BlocksFoundScreen;
