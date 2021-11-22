/* eslint-disable no-nested-ternary */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getStats } from '../Api';
import { currencyState, statsRequestIDState } from '../Atoms';
import PressableCard from '../components/PressableCard';
import {
  convertMojoToChia,
  convertSecondsToHourMin,
  currencyFormat,
  formatBytes,
} from '../utils/Formatting';
import { getCurrencyFromKey } from './CurrencySelectionScreen';

const Item = ({ title, value, color, loadable, format, onPress }) => (
  <PressableCard style={styles.item} onPress={onPress}>
    <View style={{}}>
      <Text style={{ color, fontSize: 16, textAlign: 'center' }}>{title.toUpperCase()}</Text>
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

const Content = ({ navigation }) => {
  const statsLoadable = useRecoilValueLoadable(statsQuery());
  const refresh = useRefreshStats();
  const { t } = useTranslation();

  if (statsLoadable.state === 'hasError') {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 6, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
      >
        contentContainerStyle=
        {{
          padding: 8,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        refreshControl=
        <RefreshControl refreshing={false} onRefresh={() => refresh()} />
        <Text style={{ fontSize: 20, textAlign: 'center' }}>
          Could not fetch data. Please make sure you have an internet connection. Pull down to try
          refresh again.
        </Text>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 6, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
      >
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) =>
              `${currencyFormat(
                item.xch_current_price[statsLoadable.contents.currency]
              )} ${getCurrencyFromKey(statsLoadable.contents.currency)}`
            }
            color="#4DB33E"
            title={t('common:chiaPrice')}
          />
          <Item
            onPress={() => navigation.navigate(t('common:poolSpace'))}
            loadable={statsLoadable}
            format={(item) => formatBytes(item.pool_space)}
            color="#4DB33E"
            title={t('common:poolSpace')}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => `${(item.estimate_win / 60 / 24).toFixed(3)} days`}
            color="#3DD292"
            title={t('common:etw')}
          />
          <Item
            loadable={statsLoadable}
            format={(item) => item.rewards_blocks}
            color="#FB6D4C"
            title={t('common:blocks')}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => item.farmers}
            color="#34D4F1"
            title={t('common:farmers')}
          />
          <Item
            loadable={statsLoadable}
            format={(item) => formatBytes(item.blockchain_space)}
            color="#34D4F1"
            title={t('common:netspace')}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) =>
              `${((item.time_since_last_win / (item.estimate_win * 60)) * 100).toFixed(0)}%`
            }
            color="#4DB33E"
            title={t('common:currentEffort')}
          />
          <Item
            loadable={statsLoadable}
            // value="average_effort"
            format={(item) => `${item.average_effort.toFixed(0)}%`}
            color="#4DB33E"
            title={t('common:effort')}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => convertSecondsToHourMin(item.time_since_last_win)}
            color="#4DB33E"
            title={t('common:sinceLastWin')}
          />
          <Item
            loadable={statsLoadable}
            format={(item) => `${convertMojoToChia(item.rewards_amount)} XCH`}
            color="#4DB33E"
            title={t('common:rewards')}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={statsLoadable}
            format={(item) => `${item.xch_tb_month.toFixed(8)} XCH/TiB/day`}
            color="#4DB33E"
            title={t('common:profitability')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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

  <Content navigation={navigation} />
);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  item: {
    flex: 1,
    // minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
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
