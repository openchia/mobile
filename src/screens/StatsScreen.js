/* eslint-disable no-nested-ternary */
import { useNetInfo } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getStats } from '../Api';
import { currencyState, statsRequestIDState } from '../Atoms';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';
import {
  convertMojoToChia,
  convertSecondsToHourMin,
  currencyFormat,
  formatBytes,
} from '../utils/Formatting';
import { getCurrencyFromKey } from './CurrencySelectionScreen';

const Item = ({ title, value, color, loadable, format, onPress, icon }) => (
  <PressableCard style={{ flex: 1, marginVertical: 4 }} onPress={onPress}>
    <View style={styles.item}>
      <Text style={{ color, fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
      <Text
        style={{
          textAlign: 'center',
          // marginTop: 10,
          marginBottom: 10,
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        {loadable.state === 'hasValue'
          ? format(loadable.contents.stats)
          : loadable.state === 'loading'
          ? '...'
          : 'Error occured'}
      </Text>
      <View
        style={{
          position: 'absolute',
          right: 8,
          bottom: 8,
        }}
      >
        {icon}
      </View>
    </View>
  </PressableCard>
);

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
  const statsLoadable = useRecoilValueLoadable(statsQuery());
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useRefreshStats();
  const { t } = useTranslation();
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const netInfo = useNetInfo();

  useEffect(() => {
    if (statsLoadable.state === 'hasValue') {
      setFailed(false);
      setRefreshing(false);
    } else if (statsLoadable.state === 'hasError') {
      setFailed(true);
    }
  }, [statsLoadable.state]);

  useEffect(() => {
    refresh();
  }, [refreshing]);

  if (statsLoadable.state === 'hasError') {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          Cant Connect to Network
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            if (netInfo.isConnected) refresh();
          }}
        >
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  if (failed) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 6, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              // refresh();
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
                  chiaPrice:
                    statsLoadable.contents.stats.xch_current_price[statsLoadable.contents.currency],
                },
              });
            }}
            loadable={statsLoadable}
            format={(item) =>
              `${currencyFormat(
                item.xch_current_price[statsLoadable.contents.currency]
              )} ${getCurrencyFromKey(statsLoadable.contents.currency)}`
            }
            color="#4DB33E"
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
            title={t('chiaPrice').toUpperCase()}
          />
          <View style={{ width: 8 }} />
          <Item
            onPress={() => navigation.navigate('Poolspace')}
            loadable={statsLoadable}
            format={(item) => formatBytes(item.pool_space)}
            color="#4DB33E"
            title={t('poolSpace').toUpperCase()}
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => `${(item.estimate_win / 60 / 24).toFixed(3)} days`}
            color="#3DD292"
            title={t('etw').toUpperCase()}
          />
          <View style={{ width: 8 }} />
          <Item
            loadable={statsLoadable}
            format={(item) => item.rewards_blocks}
            color="#FB6D4C"
            title={t('blocks').toUpperCase()}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => item.farmers}
            color="#34D4F1"
            title={t('farmers').toUpperCase()}
          />
          <View style={{ width: 8 }} />
          <Item
            loadable={statsLoadable}
            format={(item) => formatBytes(item.blockchain_space)}
            color="#34D4F1"
            title={t('netspace').toUpperCase()}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) =>
              `${((item.time_since_last_win / (item.estimate_win * 60)) * 100).toFixed(0)}%`
            }
            color="#4DB33E"
            title={t('currentEffort').toUpperCase()}
          />
          <View style={{ width: 8 }} />
          <Item
            loadable={statsLoadable}
            // value="average_effort"
            format={(item) => `${item.average_effort.toFixed(0)}%`}
            color="#4DB33E"
            title={t('effort').toUpperCase()}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => convertSecondsToHourMin(item.time_since_last_win)}
            color="#4DB33E"
            title={t('sinceLastWin').toUpperCase()}
          />
          <View style={{ width: 8 }} />
          <Item
            loadable={statsLoadable}
            format={(item) => `${convertMojoToChia(item.rewards_amount)} XCH`}
            color="#4DB33E"
            title={t('rewards').toUpperCase()}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => `${item.xch_tb_month.toFixed(8)} XCH/TiB/day`}
            color="#4DB33E"
            title={t('profitability').toUpperCase()}
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
    marginHorizontal: 8,
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
