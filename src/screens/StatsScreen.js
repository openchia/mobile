/* eslint-disable no-nested-ternary */
import React, { Suspense, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  selectorFamily,
  useRecoilValue,
  atomFamily,
  useSetRecoilState,
  useRecoilValueLoadable,
} from 'recoil';
import { ErrorBoundary } from 'react-error-boundary';

import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatDuration,
  secondsToHours,
} from 'date-fns';
import { useToast } from 'react-native-toast-notifications';
import { Text } from 'react-native-paper';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace, getStats } from '../Api';
import {
  convertMojoToChia,
  convertSecondsToHourMin,
  currencyFormat,
  formatBytes,
} from '../utils/Formatting';
import { statsRequestIDState } from '../Atoms';

const Item = ({ title, value, color, loadable, format }) => (
  <View style={styles.item}>
    <Text style={{ color, fontSize: 16 }}>{title}</Text>
    <Text
      style={{
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
      }}
    >
      {loadable.state === 'hasValue'
        ? format(loadable.contents)
        : loadable.state === 'loading'
        ? '...'
        : 'Error occured'}
    </Text>
    {/* <Text style={{ color, fontSize: 16 }}>
      {' '}
      {loadable.state === 'hasValue'
        ? format(loadable.contents)
        : loadable.state === 'loading'
        ? '...'
        : 'Error occured'}
    </Text> */}
  </View>
);

const useRefreshStats = () => {
  const setRequestId = useSetRecoilState(statsRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const statsQuery = selectorFamily({
  key: 'statsSelector',
  get:
    () =>
    async ({ get }) => {
      get(statsRequestIDState());
      const response = await getStats();
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
});

const Content = () => {
  const statsLoadable = useRecoilValueLoadable(statsQuery());
  const refresh = useRefreshStats();

  if (statsLoadable.state === 'hasError') {
    return (
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
      >
        <Text style={{ fontSize: 20, textAlign: 'center' }}>
          Could not fetch data. Please make sure you have an internet connection. Pull down to try
          refresh again.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 8, flex: 1, display: 'flex' }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
    >
      <View style={styles.container}>
        <Item
          loadable={statsLoadable}
          format={(item) => currencyFormat(item.xch_current_price.usd)}
          color="#4DB33E"
          title="XCH PRICE"
        />
        <Item
          loadable={statsLoadable}
          format={(item) => formatBytes(item.pool_space)}
          color="#4DB33E"
          title="POOL SPACE"
        />
      </View>
      <View style={styles.container}>
        <Item
          loadable={statsLoadable}
          format={(item) => `${(item.estimate_win / 60 / 24).toFixed(3)} days`}
          color="#3DD292"
          title="ETW"
        />
        <Item
          loadable={statsLoadable}
          format={(item) => item.rewards_blocks}
          color="#FB6D4C"
          title="BLOCKS"
        />
      </View>
      <View style={styles.container}>
        <Item
          loadable={statsLoadable}
          format={(item) => item.farmers}
          color="#34D4F1"
          title="FARMERS"
        />
        <Item
          loadable={statsLoadable}
          format={(item) => formatBytes(item.blockchain_space)}
          color="#34D4F1"
          title="NETSPACE"
        />
      </View>
      <View style={styles.container}>
        <Item
          loadable={statsLoadable}
          format={(item) =>
            `${((item.time_since_last_win / (item.estimate_win * 60)) * 100).toFixed(0)}%`
          }
          color="#4DB33E"
          title="CURRENT EFFORT"
        />
        <Item
          loadable={statsLoadable}
          // value="average_effort"
          format={(item) => `${item.average_effort.toFixed(0)}%`}
          color="#4DB33E"
          title="EFFORT"
        />
      </View>
      <View style={styles.container}>
        <Item
          loadable={statsLoadable}
          format={(item) => convertSecondsToHourMin(item.time_since_last_win)}
          color="#4DB33E"
          title="SINCE LAST WIN"
        />
        <Item
          loadable={statsLoadable}
          format={(item) => `${convertMojoToChia(item.rewards_amount)} XCH`}
          color="#4DB33E"
          title="REWARDS"
        />
      </View>
      <View style={styles.container}>
        <Item
          loadable={statsLoadable}
          format={(item) => `${item.xch_tb_month.toFixed(8)} XCH/TiB/day`}
          color="#4DB33E"
          title="PROFITABILITY"
        />
      </View>
    </ScrollView>
  );
};

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View role="alert">
      <Text>Something went wrong:</Text>
    </View>
  );
}

const StatsScreen = ({ navigation }) => (
  // const toast = useToast();
  // const statsLoadable = useRecoilValueLoadable(statsQuery());
  // const refresh = useRefreshStats();

  // if (statsLoadable.state === 'hasError') {
  //   toast.show(statsLoadable.contents);
  // }

  <SafeAreaView style={{ flex: 1 }}>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Content />
    </ErrorBoundary>
  </SafeAreaView>
);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 6,
    margin: 6,
    borderRadius: 8,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
});

export default StatsScreen;
