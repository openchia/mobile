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
import { useSetRecoilState } from 'recoil';
import { farmerRefreshState } from '../../Atoms';
import CustomCard from '../../components/CustomCard';
import LoadingComponent from '../../components/LoadingComponent';
import { formatBytes, formatPrice } from '../../utils/Formatting';
import { getCurrencyFromKey } from '../CurrencySelectionScreen';

const Item = ({ title, value, color, loadable, format }) => {
  const theme = useTheme();
  return (
    <CustomCard style={styles.item}>
      <Text numberOfLines={2} style={{ color, fontSize: 16, textAlign: 'center', maxWidth: 120 }}>
        {title}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          // marginTop: 10,
          // marginBottom: 10,
          fontSize: 20,
          // color: theme.colors.textGrey,
        }}
      >
        {loadable.state === 'hasValue' ? format(loadable.contents.partials) : '...'}
      </Text>
    </CustomCard>
  );
};

const HeaderItem = ({ loadable, launcherId, currency, t, theme }) => (
  <CustomCard style={styles.headerItem}>
    {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text style={{ flex: 1, color: theme.colors.textGrey }}>{t('friendlyName')}:</Text>
      <Text>
        {loadable.state === 'hasValue'
          ? loadable.contents.farmer.name
            ? loadable.contents.farmer.name
            : 'None'
          : '...'}
      </Text>
    </View> */}
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      <Text numberOfLines={1} style={{ color: theme.colors.textGrey }}>
        Launcher ID
      </Text>
      <TouchableOpacity
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}
        onPress={() => Clipboard.setString(launcherId)}
      >
        <Text style={{ textAlign: 'center', marginEnd: 16 }}>{launcherId}</Text>
        <MaterialCommunityIcons name="content-copy" size={16} color="grey" />
      </TouchableOpacity>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('difficulty')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {loadable.state === 'hasValue' ? loadable.contents.farmer.difficulty : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('joinedAt')}
      </Text>
      {/* <Text style={{}}>{format(new Date(item.joined_at), 'PPpp')}</Text> */}
      <Text numberOfLines={1} style={styles.val}>
        {loadable.state === 'hasValue'
          ? format(new Date(loadable.contents.farmer.joined_at), 'PPpp')
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('estimatedDailyEarnings')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {loadable.state === 'hasValue'
          ? `${formatPrice(
              (loadable.contents.farmer.estimated_size / 1099511627776) *
                loadable.contents.stats.xch_tb_month *
                loadable.contents.stats.xch_current_price[currency],
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
        {loadable.state === 'hasValue' ? loadable.contents.farmer.points : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('utilizationSpace')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {loadable.state === 'hasValue'
          ? `${loadable.contents.farmer.points_of_total.toFixed(5)}%`
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('estimatedSize')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {loadable.state === 'hasValue'
          ? formatBytes(loadable.contents.farmer.estimated_size)
          : '...'}
      </Text>
    </View>
  </CustomCard>
);

const useRefresh = () => {
  const setRequestId = useSetRecoilState(farmerRefreshState());
  return () => setRequestId((id) => id + 1);
};

const FarmerStatsScreen = ({ launcherId, dataLoadable, route, navigation }) => {
  const refresh = useRefresh();
  const errors = [];
  const harvesters = new Set();
  const { t } = useTranslation();
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [error, setError] = useState(false);
  let points = 0;

  useEffect(() => {
    if (dataLoadable.state === 'hasError') {
      setError(true);
    } else if (dataLoadable.state === 'hasValue') {
      setError(false);
    }
  }, [dataLoadable]);

  if (dataLoadable.state === 'hasError') {
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

  if (dataLoadable.state === 'hasValue') {
    dataLoadable.contents.partials.results.forEach((item) => {
      harvesters.add(item.harvester_id);
      if (item.error !== null) {
        errors.push(errors);
      } else {
        points += item.difficulty;
      }
    });
  }

  const { currency } = dataLoadable.contents;

  if (error && dataLoadable.state === 'loading') {
    return <LoadingComponent />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: 8 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
    >
      <HeaderItem
        loadable={dataLoadable}
        launcherId={launcherId}
        currency={currency}
        t={t}
        theme={theme}
      />
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          loadable={dataLoadable}
          format={(item) => item.count}
          color="#4DB33E"
          title={`${t('partials').toUpperCase()}\n(${t('24Hours').toUpperCase()})`}
          // title={`PARTIALS\n(24 HOURS)`}
        />
        <View style={{ width: 8 }} />
        <Item
          loadable={dataLoadable}
          format={() => points}
          color="#4DB33E"
          title={`${t('points').toUpperCase()}\n(${t('24Hours').toUpperCase()})`}
        />
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          loadable={dataLoadable}
          format={(item) => item.count - errors.length}
          color="#3DD292"
          title={`${t('successfulPartials').toUpperCase()}`}
        />
        <View style={{ width: 8 }} />
        <Item
          loadable={dataLoadable}
          format={() => errors.length}
          color="#FB6D4C"
          title={`${t('failedPartials').toUpperCase()}`}
        />
      </View>
      <View style={{ height: 8 }} />
      <View style={styles.container}>
        <Item
          loadable={dataLoadable}
          format={(item) => `${(((item.count - errors.length) * 100) / item.count).toFixed(1)}%`}
          color="#FB6D4C"
          title={t('partialPerfomance').toUpperCase()}
        />
        <View style={{ width: 8 }} />
        <Item
          loadable={dataLoadable}
          format={() => harvesters.size}
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

export default FarmerStatsScreen;
