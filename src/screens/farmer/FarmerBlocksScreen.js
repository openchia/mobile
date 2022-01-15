import { useNetInfo } from '@react-native-community/netinfo';
import { format, fromUnixTime } from 'date-fns';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getBlocksFromFarmer, getBlocksFromFarmers } from '../../Api';
import { farmerBlockRefreshState } from '../../Atoms';
import LoadingComponent from '../../components/LoadingComponent';
import PressableCard from '../../components/PressableCard';
import { convertMojoToChia } from '../../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(farmerBlockRefreshState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'farmerBlocks',
  get:
    (launcherIds) =>
    async ({ get }) => {
      get(farmerBlockRefreshState());
      const response = await getBlocksFromFarmers(launcherIds);
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item, color, t }) => (
  // <PressableCard onTap={() => {}}>
  //   <View
  //     style={{
  //       display: 'flex',
  //       flexDirection: 'row',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       padding: 10,
  //     }}
  //   >
  //     {/* <Text style={styles.rank}>{item.transaction}</Text> */}
  //     <Text style={styles.amount}>{`${convertMojoToChia(item.amount)} XCH`}</Text>
  //     <View style={{ flex: 1 }} />
  //     <View style={{ display: 'flex', flexDirection: 'column' }}>
  //       <Text style={styles.block}>{item.confirmed_block_index}</Text>
  //       <Text style={styles.date}>{format(fromUnixTime(item.timestamp), 'PPpp')}</Text>
  //     </View>
  //   </View>
  // </PressableCard>
  <PressableCard style={{ marginHorizontal: 8, marginVertical: 2 }} onTap={() => {}}>
    <View style={{ display: 'flex', flexDirection: 'column', padding: 8 }}>
      {/* <Text style={styles.rank}>{item.id}</Text>
      <Text style={styles.date}>{format(new Date(item.datetime), 'PPpp')}</Text>
      <Text style={styles.size}>{`${convertMojoToChia(item.amount)} XCH`}</Text> */}

      {/* <View style={{ padding: 8, display: 'flex' }}> */}
      <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
        <Text style={[styles.title, { color }]}>{t('amount')}</Text>
        <Text numberOfLines={1} style={[styles.val, { fontWeight: 'bold' }]}>{`${convertMojoToChia(
          item.amount
        )} XCH`}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Text style={[styles.title, { color }]}>{t('height')}</Text>
        <Text numberOfLines={1} style={[styles.val, { fontWeight: 'bold' }]}>
          {item.confirmed_block_index}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Text style={[styles.title, { color }]}>{t('date')}</Text>
        <Text numberOfLines={1} style={[styles.val, { fontWeight: 'bold' }]}>
          {format(fromUnixTime(item.timestamp), 'PPpp')}
        </Text>
      </View>
    </View>
    {/* </View> */}
  </PressableCard>
);

const Content = ({ launcherIds }) => {
  const refresh = useRefresh();
  const blocksLoadable = useRecoilValueLoadable(query(launcherIds));
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const netInfo = useNetInfo();

  useEffect(() => {
    if (blocksLoadable.state === 'hasValue') {
      const intersection = (arr) => arr.reduce((a, e) => [...a, ...e], []);
      setData(
        intersection(blocksLoadable.contents.map((item) => item.results)).sort(
          (a, b) => b.timestamp - a.timestamp
        )
      );
      // setRefreshing(false);
      // setData(blocksLoadable.contents.results);
      setRefreshing(false);
    }
  }, [blocksLoadable.state]);

  if (blocksLoadable.state === 'hasError') {
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

  if (blocksLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
  }

  const renderItem = ({ item }) => <Item item={item} color={theme.colors.textGrey} t={t} />;

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
          No blocks won yet. Pull down to refresh.
        </Text>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={<View style={{ marginTop: 8 }} />}
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
        keyExtractor={(item) => item.confirmed_block_index.toString()}
      />
    </SafeAreaView>
  );
};

const FarmerBlockScreen = ({ launcherIds }) => (
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

export default FarmerBlockScreen;
