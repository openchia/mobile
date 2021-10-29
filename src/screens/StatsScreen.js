import React, { Suspense, useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import { selectorFamily, useRecoilValue } from 'recoil';
import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatDuration,
  secondsToHours,
} from 'date-fns';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace, getStats } from '../Api';
import {
  convertMojoToChia,
  convertSecondsToHourMin,
  currencyFormat,
  formatBytes,
} from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';

const Item = ({ title, value, color }) => (
  <View style={styles.item}>
    <Text style={{ color }}>{title}</Text>
    <Text>{value}</Text>
  </View>
);

const statsQuery = selectorFamily({
  key: 'statsSelector',
  get: () => async () => {
    const response = await getStats();
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const Content = () => {
  const stats = useRecoilValue(statsQuery());

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Item
          value={currencyFormat(stats.xch_current_price.usd)}
          color="#4DB33E"
          title="XCH PRICE"
        />
        <Item value={formatBytes(stats.pool_space)} color="#4DB33E" title="POOL SPACE" />
      </View>
      <View style={styles.container}>
        <Item
          value={`${(stats.estimate_win / 60 / 24).toFixed(3)} days`}
          color="#3DD292"
          title="ETW"
        />
        <Item value={stats.rewards_blocks} color="#FB6D4C" title="BLOCKS" />
      </View>
      <View style={styles.container}>
        <Item value={stats.farmers} color="#34D4F1" title="FARMERS" />
        <Item value={formatBytes(stats.blockchain_space)} color="#34D4F1" title="NETSPACE" />
      </View>
      <View style={styles.container}>
        <Item
          value={`${((stats.time_since_last_win / (stats.estimate_win * 60)) * 100).toFixed(0)}%`}
          color="#4DB33E"
          title="CURRENT EFFORT"
        />
        <Item value={`${stats.average_effort.toFixed(0)}%`} color="#4DB33E" title="EFFORT" />
      </View>
      <View style={styles.container}>
        <Item
          // value={formatDistanceToNow(new Date(stats.last_rewards[0].date))}
          // value={secondsToHours(new Date(stats.time_since_last_win))}
          value={convertSecondsToHourMin(stats.time_since_last_win)}
          color="#4DB33E"
          title="SINCE LAST WIN"
        />
        <Item
          value={`${convertMojoToChia(stats.rewards_amount)} XCH`}
          color="#4DB33E"
          title="REWARDS"
        />
      </View>
      <View style={styles.container}>
        <Item value={`${stats.xch_tb_month} XCH/TiB/day`} color="#4DB33E" title="PROFITABILITY" />
      </View>
      {/* {isLoading ? <ActivityIndicator /> : <AreaChartNetspace data={data} />} */}
    </SafeAreaView>
  );
};

const StatsScreen = ({ navigation }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content />
  </Suspense>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 6,
    margin: 6,
    marginEnd: 10,
    marginStart: 10,
    height: 86,
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
