/* eslint-disable no-nested-ternary */
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNetInfo } from '@react-native-community/netinfo';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { currencyState, farmerRefreshState } from '../../Atoms';
import CustomCard from '../../components/CustomCard';
import LoadingComponent from '../../components/LoadingComponent';
import { formatBytes, formatPrice } from '../../utils/Formatting';
import { getCurrencyFromKey } from '../CurrencySelectionScreen';

const Item = ({ title, color, value, format }) => {
  const theme = useTheme();
  return (
    <CustomCard style={styles.item}>
      <Text
        numberOfLines={2}
        style={{ color, fontSize: 16, textAlign: 'center', maxWidth: 120, fontWeight: 'bold' }}
      >
        {title}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
        }}
      >
        {value ? format(value) : '...'}
      </Text>
    </CustomCard>
  );
};

const HeaderItem = ({
  farmerDataAndStats,
  farmerDataAndStatsState,
  launcherIds,
  currency,
  t,
  theme,
}) => (
  <CustomCard style={styles.headerItem}>
    {launcherIds.length === 1 && (
      <>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={{ flex: 1, color: theme.colors.textGrey }}>{t('friendlyName')}:</Text>
          <Text>
            {farmerDataAndStatsState === 'hasValue'
              ? farmerDataAndStats.farmers[0].name
                ? farmerDataAndStats.farmers[0].name
                : 'None'
              : '...'}
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text numberOfLines={1} style={{ color: theme.colors.textGrey }}>
            Launcher ID
          </Text>
          <TouchableOpacity
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}
            onPress={() => Clipboard.setString(launcherIds[0])}
          >
            <Text style={{ textAlign: 'center', marginEnd: 16 }}>{launcherIds[0]}</Text>
            <Ionicons name="copy-outline" size={16} color="grey" />
          </TouchableOpacity>
        </View>
      </>
    )}

    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('difficulty')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {farmerDataAndStatsState === 'hasValue'
          ? farmerDataAndStats.farmers
              .map((item) => item.difficulty)
              .reduce((acc, item) => acc + item)
          : '...'}
      </Text>
    </View>
    {launcherIds.length === 1 && (
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
          {t('joinedAt')}
        </Text>
        <Text numberOfLines={1} style={styles.val}>
          {farmerDataAndStatsState === 'hasValue'
            ? format(new Date(farmerDataAndStats.farmers[0].joined_at), 'PPpp')
            : '...'}
        </Text>
      </View>
    )}
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('estimatedDailyEarnings')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {farmerDataAndStatsState === 'hasValue'
          ? `${formatPrice(
              (farmerDataAndStats.farmers
                .map((item) => item.estimated_size)
                .reduce((acc, item) => acc + item) /
                1099511627776) *
                farmerDataAndStats.stats.xch_tb_month *
                farmerDataAndStats.stats.xch_current_price[currency],
              currency
            )}  ${getCurrencyFromKey(currency)}`
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('points')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {farmerDataAndStatsState === 'hasValue'
          ? farmerDataAndStats.farmers.map((item) => item.points).reduce((acc, item) => acc + item)
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('utilizationSpace')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {farmerDataAndStatsState === 'hasValue'
          ? `${farmerDataAndStats.farmers
              .map((item) => item.points_of_total)
              .reduce((acc, item) => acc + item)
              .toFixed(5)}%`
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('estimatedSize')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {farmerDataAndStatsState === 'hasValue'
          ? formatBytes(
              farmerDataAndStats.farmers
                .map((item) => item.estimated_size)
                .reduce((acc, item) => acc + item)
            )
          : '...'}
      </Text>
    </View>
  </CustomCard>
);

const useRefresh = () => {
  const setRequestId = useSetRecoilState(farmerRefreshState());
  return () => setRequestId((id) => id + 1);
};

const partialPerfomance = (partialCount, failedPartialCount) =>
  ((partialCount - failedPartialCount) * 100) / partialCount;

const FarmerStatsScreenTest = ({
  farmerDataAndStats,
  farmerDataAndStatsState,
  farmerPartials,
  farmerPartialsState,
  route,
  navigation,
  launcherIds,
}) => {
  const refresh = useRefresh();
  // const errors = [];
  const currency = useRecoilValue(currencyState);
  // const harvesters = new Set();
  const { t } = useTranslation();
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [error, setError] = useState(false);
  const [partialStats, setPartialStats] = useState(null);

  useEffect(() => {
    if (farmerPartialsState === 'hasValue') {
      const harvesters = new Set();
      const failedPartials = [];
      const successfulPartials = [];
      let partialCount = 0;
      let points = 0;
      farmerPartials.forEach((farm) => {
        // console.log(farm);
        farm.results.forEach((item) => {
          harvesters.add(item.harvester_id);
          if (item.error !== null) {
            failedPartials.push(item);
          } else {
            successfulPartials.push(item);
            points += item.difficulty;
          }
          partialCount += 1;
        });
      });
      setPartialStats({
        harvesters,
        failedPartials,
        successfulPartials,
        points,
        partialCount,
        partialPerfomance: partialPerfomance(partialCount, failedPartials.length),
      });
    }
  }, [farmerPartialsState]);

  if (farmerDataAndStatsState === 'hasError') {
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

  // if (state === 'loading') {
  //   return <LoadingComponent />;
  // }
  // useEffect(() => {
  //   if (dataLoadable.state === 'hasError') {
  //     setError(true);
  //   } else if (dataLoadable.state === 'hasValue') {
  //     setError(false);
  //   }
  // }, [dataLoadable]);

  // if (dataLoadable.state === 'hasError') {
  //   return (
  // <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
  //   <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
  //     Cant Connect to Network
  //   </Text>
  //   <Button
  //     mode="contained"
  //     onPress={() => {
  //       if (netInfo.isConnected) refresh();
  //     }}
  //   >
  //     Retry
  //   </Button>
  // </SafeAreaView>
  //   );
  // }

  // let object = {};

  // if (farmerPartialsState === 'hasValue') {
  //   farmerPartials.forEach((farm) => {
  //     farm.results.forEach((item) => {
  //       harvesters.add(item.harvester_id);
  //       if (item.error !== null) {
  //         errors.push(errors);
  //       } else {
  //         points += item.difficulty;
  //       }
  //     });
  //   });
  // }

  // if (error && dataLoadable.state === 'loading') {
  //   return <LoadingComponent />;
  // }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: 8 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
    >
      <HeaderItem
        farmerDataAndStats={farmerDataAndStats}
        farmerDataAndStatsState={farmerDataAndStatsState}
        launcherIds={launcherIds}
        currency={currency}
        t={t}
        theme={theme}
      />
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          // partialStats={partialStats}
          value={partialStats}
          format={(item) => item.partialCount}
          color="#4DB33E"
          title={`${t('partials').toUpperCase()}\n(${t('24Hours').toUpperCase()})`}
          // title={`PARTIALS\n(24 HOURS)`}
        />
        <View style={{ width: 8 }} />
        <Item
          // partialStats={partialStats}
          value={partialStats}
          format={(item) => item.points}
          color="#4DB33E"
          title={`${t('points').toUpperCase()}\n(${t('24Hours').toUpperCase()})`}
        />
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          value={partialStats}
          format={(item) => item.successfulPartials.length}
          color="#3DD292"
          title={`${t('successfulPartials').toUpperCase()}`}
        />
        <View style={{ width: 8 }} />
        <Item
          value={partialStats}
          format={(item) => item.failedPartials.length}
          color="#FB6D4C"
          title={`${t('failedPartials').toUpperCase()}`}
        />
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          value={partialStats}
          format={(item) => `${item.partialPerfomance.toFixed(1)}%`}
          color="#FB6D4C"
          title={t('partialPerfomance').toUpperCase()}
        />
        <View style={{ width: 8 }} />
        <Item
          value={partialStats}
          format={(item) => item.harvesters.size}
          color="#34D4F1"
          title={t('harvesterCount').toUpperCase()}
        />
      </View>
      {/* <View style={{ height: 8 }} /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    display: 'flex',
    // paddingBottom: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    // marginVertical: 4,
  },
  headerItem: {
    justifyContent: 'center',
    flexDirection: 'column',
    // marginVertical: 8,
    padding: 6,
  },
  title: {
    fontSize: 14,
    marginEnd: 8,
  },
  val: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
});

export default FarmerStatsScreenTest;
