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
import PressableCard from '../components/PressableCard';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(payoutsRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'payouts',
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
  <PressableCard onTap={() => {}}>
    <View style={{ display: 'flex', flexDirection: 'row', padding: 12 }}>
      <Text style={styles.rank}>{item.id}</Text>
      <Text style={styles.size}>{format(new Date(item.datetime), 'PPpp')}</Text>
      <Text style={styles.size}>{`${convertMojoToChia(item.amount)} XCH`}</Text>
    </View>
  </PressableCard>
);

const Content = () => {
  const refresh = useRefresh();
  const payouts = useRecoilValue(query());

  const renderItem = ({ item, index }) => <Item item={item} rank={index} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
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
