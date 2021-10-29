import React, { Suspense, useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import { selectorFamily, useRecoilValue } from 'recoil';
import { format } from 'date-fns';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getPayouts } from '../Api';
import { formatBytes, convertMojoToChia } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';

const query = selectorFamily({
  key: 'payoutsSelector',
  get: () => async () => {
    const response = await getPayouts();
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const Item = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.rank}>{item.id}</Text>
    <Text style={styles.size}>{format(new Date(item.datetime), 'PPpp')}</Text>
    <Text style={styles.size}>{`${convertMojoToChia(item.amount)} XCH`}</Text>
  </View>
);

const Content = () => {
  const payouts = useRecoilValue(query());

  const renderItem = ({ item, index }) => <Item item={item} rank={index} />;

  return (
    <SafeAreaView>
      <FlatList
        data={payouts.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const PayoutScreen = ({ navigation }) => (
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
  },
  rank: {
    fontSize: 14,
    marginEnd: 20,
  },
  name: {
    fontSize: 14,
    marginEnd: 20,
    color: '#407538',
    flex: 1,
  },
  size: {
    marginLeft: 'auto',
    fontSize: 14,
  },
});

export default PayoutScreen;
