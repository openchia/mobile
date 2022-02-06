/* eslint-disable no-nested-ternary */
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropShadow from 'react-native-drop-shadow';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectorFamily, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getStats } from '../Api';
import { currencyState, initialRouteState, statsRequestIDState } from '../Atoms';
import LoadingComponent from '../components/LoadingComponent';

import PressableCard from '../components/PressableCard';
import {
  convertMojoToChia,
  convertSecondsToHourMin,
  currencyFormat,
  formatBytes,
} from '../utils/Formatting';
import { getCurrencyFromKey } from './CurrencySelectionScreen';

const Item = ({ title, value, color, loadable, data, format, onPress, icon }) => {
  const theme = useTheme();
  return (
    <DropShadow
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.05,
        // shadowOpacity: 1,
        shadowRadius: 3,
        flex: 1,
        marginVertical: 8,
      }}
    >
      <PressableCard
        style={{ borderRadius: 24, backgroundColor: theme.colors.onSurfaceLight }}
        onPress={onPress}
      >
        <View style={styles.item}>
          <Text style={{ color, fontSize: 16, textAlign: 'center' }}>{title}</Text>
          <Text
            style={{
              textAlign: 'center',
              // marginTop: 10,
              marginBottom: 10,
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            {!loadable ? format(data) : '...'}
          </Text>
          <View
            style={{
              position: 'absolute',
              right: 12,
              bottom: 12,
            }}
          >
            {icon}
          </View>
        </View>
      </PressableCard>
    </DropShadow>
  );
};
const useRefreshStats = () => {
  const setRequestId = useSetRecoilState(statsRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const statsQuery = selectorFamily({
  key: 'stats',
  get:
    () =>
    async ({ get }) => {
      get(statsRequestIDState());
      const response = await getStats();
      const currency = get(currencyState);
      if (response.error) {
        throw new Error(response.error);
      }
      return { stats: response, currency };
    },
});

const StatsScreen = ({ navigation }) => {
  // const statsLoadable = useRecoilValueLoadable(statsQuery());
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useRefreshStats();
  const { t } = useTranslation();
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const netInfo = useNetInfo();
  const [initialRoute, setIntialRoute] = useRecoilState(initialRouteState);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const currency = useRecoilValue(currencyState);

  useEffect(() => {
    getStats()
      .then((stats) => setData(stats))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   if (statsLoadable.state === 'hasValue') {
  //     setFailed(false);
  //     setRefreshing(false);
  //   } else if (statsLoadable.state === 'hasError') {
  //     setFailed(true);
  //   }
  // }, [statsLoadable.state]);

  // useEffect(() => {
  //   refresh();
  // }, [refreshing]);

  // if (statsLoadable.state === 'hasError') {
  //   return (
  //     <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
  //       <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
  //         Cant Connect to Network
  //       </Text>
  //       <Button
  //         mode="contained"
  //         onPress={() => {
  //           if (netInfo.isConnected) refresh();
  //         }}
  //       >
  //         Retry
  //       </Button>
  //     </SafeAreaView>
  //   );
  // }

  // if (failed) {
  //   return <LoadingComponent />;
  // }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 6, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              getStats()
                .then((stats) => setData(stats))
                .finally(() => {
                  setRefreshing(false);
                });
            }}
          />
        }
      >
        <View style={styles.container}>
          <Item
            onPress={() => {
              // navigation.navigate('Chia Price Chart');
              navigation.navigate({
                name: 'Chia Price Chart',
                params: {
                  chiaPrice: data.xch_current_price[currency],
                },
              });
            }}
            loadable={loading}
            data={data}
            // format={(item) => `${currencyFormat(2426.62)} ${getCurrencyFromKey(currency)}`}
            format={(item) =>
              `${currencyFormat(item.xch_current_price[currency])} ${getCurrencyFromKey(currency)}`
            }
            color={theme.colors.green}
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
            title={t('chiaPrice')}
          />
          <View style={{ width: 16 }} />
          <Item
            onPress={() => {
              navigation.navigate({
                name: 'Poolspace',
                params: {
                  poolSpace: formatBytes(data.pool_space),
                },
              });
            }}
            loadable={loading}
            data={data}
            format={(item) => formatBytes(item.pool_space)}
            color={theme.colors.blue}
            title={t('poolSpace')}
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            data={data}
            format={(item) => `${convertSecondsToHourMin(item.estimate_win * 60)}`}
            color={theme.colors.indigo}
            title={t('etw').toUpperCase()}
          />
          <View style={{ width: 16 }} />
          <Item
            onPress={() => {
              // navigation.navigate('Root', { screen: 'Blocks Found', intial: false });
              // setIntialRoute({ name: 'Blocks Found' });
              navigation.navigate('Blocks');
            }}
            loadable={loading}
            data={data}
            format={(item) => item.rewards_blocks}
            color={theme.colors.orange}
            title={t('blocks')}
            icon={<Ionicons name="layers-outline" size={16} color={theme.colors.textGrey} />}
          />
        </View>
        <View style={styles.container}>
          {/* <Item
            onPress={() => {
              navigation.navigate('Root', { screen: 'Farmers', intial: false });
              setIntialRoute({ name: 'Farmers' });
            }}
            loadable={statsLoadable}
            format={(item) => item.farmers}
            color="#34D4F1"
            title={t('farmers')}
            icon={<Ionicons name="people-outline" size={16} color={theme.colors.textGrey} />}
          /> */}
          <Item
            onPress={() => {
              navigation.navigate('Farmers');
              // setIntialRoute({ name: 'Farmers' });
            }}
            loadable={loading}
            data={data}
            format={(item) => item.farmers_active}
            color={theme.colors.pink}
            title={t('farmers')}
            icon={<Ionicons name="people-outline" size={16} color={theme.colors.textGrey} />}
          />
          <View style={{ width: 16 }} />
          <Item
            onPress={() => {
              navigation.navigate({
                name: 'Netspace',
                params: {
                  netspace: formatBytes(data.blockchain_space),
                },
              });
            }}
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
            loadable={loading}
            data={data}
            format={(item) => formatBytes(item.blockchain_space)}
            color="#34D4F1"
            title={t('netspace')}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            data={data}
            format={(item) =>
              `${((item.time_since_last_win / (item.estimate_win * 60)) * 100).toFixed(0)}%`
            }
            color={theme.colors.purple}
            title={t('currentEffort')}
          />
          <View style={{ width: 16 }} />
          <Item
            loadable={loading}
            data={data}
            // value="average_effort"
            format={(item) => `${item.average_effort.toFixed(0)}%`}
            color={theme.colors.red}
            title={t('effort')}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            data={data}
            format={(item) => convertSecondsToHourMin(item.time_since_last_win)}
            color="#4DB33E"
            title={t('sinceLastWin')}
          />
          <View style={{ width: 16 }} />
          <Item
            onPress={() => {
              // navigation.navigate('Root', { screen: 'Payouts', intial: false });
              // setIntialRoute({ name: 'Payouts' });
              navigation.navigate('Payouts');
            }}
            loadable={loading}
            data={data}
            format={(item) => `${convertMojoToChia(item.rewards_amount)} XCH`}
            color={theme.colors.teal}
            title={t('rewards')}
            icon={<Ionicons name="ios-card-outline" size={16} color={theme.colors.textGrey} />}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            data={data}
            format={(item) => `${item.xch_tb_month.toFixed(8)} XCH/TiB/day`}
            color={theme.colors.yellow}
            title={t('profitability')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 16,
  },
  item: {
    height: '100%',
    // minHeight: 100,
    // alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'column',
    // display: 'flex',
    // backgroundColor: '#fff',
    // elevation: 6,
    // margin: 6,
    // borderRadius: 8,
    // borderColor: '#fff', // if you need
    // borderWidth: 1,
    // overflow: 'hidden',
    // shadowColor: '#000',
    // shadowRadius: 10,
    // shadowOpacity: 1,
  },
});

export default StatsScreen;
