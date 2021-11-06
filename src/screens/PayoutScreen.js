import React, { Suspense, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { format } from 'date-fns';
import { Text } from 'react-native-paper';
import { getPayouts } from '../Api';
import { formatBytes, convertMojoToChia } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import { payoutsRequestIDState } from '../Atoms';
import CustomCard from '../components/CustomCard';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(payoutsRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'payoutsSelector',
  get:
    () =>
    async ({ get }) => {
      get(payoutsRequestIDState());
      const response = await getPayouts();
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item }) => (
  <CustomCard
    style={{ padding: 8, display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center' }}
  >
    <Text style={styles.rank}>{item.id}</Text>
    <Text style={styles.size}>{format(new Date(item.datetime), 'PPpp')}</Text>
    <Text style={styles.size}>{`${convertMojoToChia(item.amount)} XCH`}</Text>
  </CustomCard>
);

const Content = () => {
  const refresh = useRefresh();
  const payouts = useRecoilValue(query());

  const renderItem = ({ item, index }) => <Item item={item} rank={index} />;

  return (
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={<View style={{ marginTop: 8 }} />}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
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
  rank: {
    fontSize: 14,
    marginEnd: 12,
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
