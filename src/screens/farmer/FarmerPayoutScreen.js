import { useNetInfo } from '@react-native-community/netinfo';
import { format, getUnixTime, isAfter } from 'date-fns';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getPayoutsFromAddress, getPayoutsFromAddresses } from '../../Api';
import { farmerPayoutsRefreshState } from '../../Atoms';
import LoadingComponent from '../../components/LoadingComponent';
import PressableCard from '../../components/PressableCard';
import { convertMojoToChia } from '../../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(farmerPayoutsRefreshState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'farmerPayouts',
  get:
    (launcherIds) =>
    async ({ get }) => {
      get(farmerPayoutsRefreshState());
      const response = await getPayoutsFromAddresses(launcherIds);
      // console.log(response);
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item, theme, t }) => (
  <PressableCard style={{ marginHorizontal: 8, marginVertical: 2 }} onTap={() => {}}>
    <View style={{ display: 'flex', flexDirection: 'column', padding: 8, flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('amount')}</Text>
        <Text style={[styles.val, { fontWeight: 'bold' }]}>{`${convertMojoToChia(
          item.amount
        )} XCH`}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('id')}</Text>
        <Text style={styles.val}>{item.confirmed_block_index}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('date')}</Text>
        <Text style={styles.val}>{format(new Date(item.payout.datetime), 'PPpp')}</Text>
      </View>
    </View>
    {/* </View> */}
  </PressableCard>
);

const Content = ({ launcherIds }) => {
  const refresh = useRefresh();
  const payoutsLoadable = useRecoilValueLoadable(query(launcherIds));
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const netInfo = useNetInfo();
  const theme = useTheme();

  useEffect(() => {
    if (payoutsLoadable.state === 'hasValue') {
      const intersection = (arr) => arr.reduce((a, e) => [...a, ...e], []);
      setData(
        intersection(payoutsLoadable.contents.map((item) => item.results)).sort(
          (a, b) => new Date(b.payout.datetime) - new Date(a.payout.datetime)
        )
      );
      setRefreshing(false);
    }
  }, [payoutsLoadable.state]);

  const renderItem = ({ item }) => <Item item={item} theme={theme} t={t} />;

  if (payoutsLoadable.state === 'hasError') {
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

  if (payoutsLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
  }

  if (data.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              refresh();
            }}
          />
        }
      >
        <Text style={{ textAlign: 'center', fontSize: 30, padding: 10 }}>
          {t('noPayoutsRecieved')}
        </Text>
      </ScrollView>
    );
  }

  const totalChia = data.map((item) => item.amount).reduce((prev, next) => prev + next);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ margin: 16, flexDirection: 'row' }}>
        <Text style={{ marginEnd: 4, fontSize: 16 }}>{t('totalChiaAccumulated')}</Text>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'right', flex: 1 }}
        >
          {convertMojoToChia(totalChia)} XCH
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              refresh();
            }}
          />
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const FarmerPayoutScreen = ({ navigation, launcherIds }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content launcherIds={launcherIds} />
  </Suspense>
);

const styles = StyleSheet.create({
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

export default FarmerPayoutScreen;
