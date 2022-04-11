/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useRecoilRefresher_UNSTABLE as useRecoilRefresher,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import PressableCard from '../../components/PressableCard';
import { currencyState, settingsState, statsQuery } from '../../recoil/Atoms';
import {
  convertMojoToChia,
  convertSecondsToHourMin,
  currencyFormat,
  formatBytes,
} from '../../utils/Formatting';
import { getCurrencyFromKey } from '../more/Currency';

const Item = ({ title, value, color, loadable, data, format, onPress, icon, settings, error }) => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, margin: 6 }}>
      <Shadow
        distance={6}
        startColor="rgba(0, 0, 0, 0.02)"
        finalColor="rgba(0, 0, 0, 0.0)"
        radius={settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius}
        viewStyle={{ height: '100%', width: '100%' }}
      >
        <PressableCard
          style={{
            borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
            backgroundColor: theme.colors.onSurfaceLight,
            // padding: 4,
          }}
          onPress={onPress}
        >
          <View style={styles.item}>
            <Text numberOfLines={1} style={{ color, fontSize: 14, textAlign: 'center' }}>
              {title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                textAlign: 'center',
              }}
            >
              {!loadable && !error ? format(data) : '...'}
            </Text>
            <View
              style={{
                position: 'absolute',
                right: 4,
                bottom: 4,
              }}
            >
              {icon}
            </View>
          </View>
        </PressableCard>
      </Shadow>
    </View>
  );
};

const Content = ({ navigation }) => {
  const statsLoadable = useRecoilValueLoadable(statsQuery());
  const refreshStats = useRecoilRefresher(statsQuery());
  const { t } = useTranslation();
  const theme = useTheme();
  const currency = useRecoilValue(currencyState);
  const settings = useRecoilValue(settingsState);
  const [refreshing, setRefreshing] = useState(false);

  const loading = statsLoadable.state === 'loading';
  const error = statsLoadable.state === 'hasError';
  if (error) {
    throw new Error('No Internet');
  }

  useEffect(() => {
    if (refreshing && statsLoadable.state === 'hasValue') {
      setRefreshing(false);
    }
  }, [statsLoadable.state]);

  // if (statsLoadable.state === 'hasValue') console.log(statsLoadable.contents);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 6,
          paddingBottom: 6,
          marginHorizontal: 6,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              refreshStats();
            }}
          />
        }
      >
        <View style={styles.container}>
          <Item
            onPress={() => {
              navigation.navigate({
                name: 'Chia Price Chart',
                params: {
                  chiaPrice: statsLoadable.contents.xch_current_price[currency],
                },
              });
            }}
            error={error}
            loadable={loading}
            data={statsLoadable.contents}
            format={(item) =>
              `${currencyFormat(item.xch_current_price[currency])} ${getCurrencyFromKey(currency)}`
            }
            color={theme.colors.green}
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
            title={t('chiaPrice')}
            settings={settings}
          />
          <Item
            onPress={() => {
              navigation.navigate({
                name: 'Poolspace',
                params: {
                  poolSpace: formatBytes(statsLoadable.contents.pool_space),
                },
              });
            }}
            error={error}
            loadable={loading}
            data={statsLoadable.contents}
            format={(item) => formatBytes(item.pool_space)}
            color={theme.colors.blue}
            title={t('poolSpace')}
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
            settings={settings}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => `${convertSecondsToHourMin(item.estimate_win * 60)}`}
            color={theme.colors.indigo}
            title={t('etw').toUpperCase()}
            settings={settings}
          />
          <Item
            onPress={() => {
              navigation.navigate('Blocks');
            }}
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => item.rewards_blocks}
            color={theme.colors.orange}
            title={t('blocks')}
            icon={<Ionicons name="layers-outline" size={16} color={theme.colors.textGrey} />}
            settings={settings}
          />
        </View>
        <View style={styles.container}>
          <Item
            onPress={() => {
              navigation.navigate('Farmers');
            }}
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => item.farmers_active}
            color={theme.colors.pink}
            title={t('farmers')}
            icon={<Ionicons name="people-outline" size={16} color={theme.colors.textGrey} />}
            settings={settings}
          />
          <Item
            onPress={() => {
              navigation.navigate({
                name: 'Netspace',
                params: {
                  netspace: formatBytes(statsLoadable.contents.blockchain_space),
                },
              });
            }}
            icon={
              <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.textGrey} />
            }
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => formatBytes(item.blockchain_space)}
            color="#34D4F1"
            title={t('netspace')}
            settings={settings}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) =>
              `${((item.time_since_last_win / (item.estimate_win * 60)) * 100).toFixed(0)}%`
            }
            color={theme.colors.purple}
            title={t('currentEffort')}
            settings={settings}
          />
          <Item
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => `${item.average_effort.toFixed(0)}%`}
            color={theme.colors.red}
            title={t('effort')}
            settings={settings}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => convertSecondsToHourMin(item.time_since_last_win)}
            color="#4DB33E"
            title={t('sinceLastWin')}
            settings={settings}
          />
          <Item
            onPress={() => {
              navigation.navigate('Payouts');
            }}
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => `${convertMojoToChia(item.rewards_amount)} XCH`}
            color={theme.colors.teal}
            title={t('rewards')}
            icon={<Ionicons name="ios-card-outline" size={16} color={theme.colors.textGrey} />}
            settings={settings}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={loading}
            error={error}
            data={statsLoadable.contents}
            format={(item) => `${item.xch_tb_month.toFixed(8)} XCH/TiB/day`}
            color={theme.colors.yellow}
            title={t('profitability')}
            settings={settings}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const theme = useTheme();
  const refreshStats = useRecoilRefresher(statsQuery());

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: theme.colors.onSurfaceLight,
      }}
    >
      <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16 }}>{error.message}</Text>
      <Button
        mode="contained"
        onPress={() => {
          refreshStats();
          resetErrorBoundary();
        }}
      >
        Retry
      </Button>
    </SafeAreaView>
  );
};

const StatsScreen = (props) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Content {...props} />
  </ErrorBoundary>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  item: {
    height: '100%',
    justifyContent: 'center',
  },
});

export default StatsScreen;
