import React, { useEffect, useState } from 'react';
import { SafeAreaView, ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import { selectorFamily, useRecoilValue } from 'recoil';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace, getStats } from '../Api';
import LoadingWrapper from '../components/LoadingWrapper';

const Card = () => (
  <View style={{ padding: 20 }}>
    <Text>Hello</Text>
  </View>
);

const DATA = [
  {
    id: 'price',
    title: 'XCH Price',
    color: '#4DB33E',
  },
  {
    id: 'pool_space',
    title: 'Pool Space',
    color: '#4DB33E',
  },
  {
    id: 'etw',
    title: 'ETW',
    color: '#4DB33E',
  },
  {
    id: 'blocks',
    title: 'Blocks',
    color: '#4DB33E',
  },
  {
    id: 'farmers',
    title: 'Farmers',
    color: '#4DB33E',
  },
  {
    id: 'netspace',
    title: 'Netspace',
    color: '#4DB33E',
  },
  {
    id: 'current_effort',
    title: 'Current Effort',
    color: '#4DB33E',
  },
  {
    id: 'effort',
    title: 'Effort',
    color: '#4DB33E',
  },
  {
    id: 'since_last_win',
    title: 'Since Last Win',
    color: '#4DB33E',
  },
  {
    id: 'rewards',
    title: 'Rewards',
    color: '#4DB33E',
  },
  {
    id: 'profitability',
    title: 'Profitability',
    color: '#4DB33E',
  },
];

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

const StatsScreen = ({ navigation }) => {
  const stats = useRecoilValue(statsQuery());
  //   console.log(stats);

  const renderItem = ({ item }) => <Item item={item} textColor="black" />;

  //   useEffect(() => {
  //     getNetspace()
  //       .then((data) => {
  //         setData(data);
  //       })
  //       .finally(() => setLoading(false));
  //   }, []);

  const currencyFormat = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'usd',
    }).format(value);

  function roundNumber(num, scale) {
    if (!`${num}`.includes('e')) {
      return +`${Math.round(`${num}e+${scale}`)}e-${scale}`;
    }
    const arr = `${num}`.split('e');
    let sig = '';
    if (+arr[1] + scale > 0) {
      sig = '+';
    }
    return +`${Math.round(`${+arr[0]}e${sig}${+arr[1] + scale}`)}e-${scale}`;
  }

  function formatBytes(bytes) {
    const sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    if (bytes == 0) return '';
    if (bytes == 1) return '1 byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${i == 0 ? bytes / Math.pow(1024, i) : roundNumber(bytes / Math.pow(1024, i), 2)} ${
      sizes[i]
    }`; // .round
  }

  const convertMojoToChia = (mojo) => mojo / 10 ** 12;

  return (
    <LoadingWrapper>
      {/* <Text>Welcome to OpenChia.io</Text> */}
      {/* <FlatList
        style={{ marginTop: 10 }}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      /> */}
      <View style={styles.container}>
        <Item
          value={currencyFormat(stats.xch_current_price.usd)}
          color="#4DB33E"
          title="XCH PRICE"
          format={currencyFormat}
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
          value={formatDistanceToNow(new Date(stats.last_rewards[0].date))}
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
    </LoadingWrapper>
  );
};

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
