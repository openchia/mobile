import { format, fromUnixTime } from 'date-fns';
import React, { Suspense } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { getBlocksFromFarmer } from '../Api';
import { farmerBlockRefreshState } from '../Atoms';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';
import { convertMojoToChia } from '../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(farmerBlockRefreshState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'farmerBlocks',
  get:
    (launcherId) =>
    async ({ get }) => {
      get(farmerBlockRefreshState());
      const response = await getBlocksFromFarmer(launcherId);
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item }) => (
  <PressableCard onTap={() => {}}>
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      }}
    >
      {/* <Text style={styles.rank}>{item.transaction}</Text> */}
      <Text style={styles.amount}>{`${convertMojoToChia(item.amount)} XCH`}</Text>
      <View style={{ flex: 1 }} />
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <Text style={styles.block}>{item.confirmed_block_index}</Text>
        <Text style={styles.date}>{format(fromUnixTime(item.timestamp), 'PPpp')}</Text>
      </View>
    </View>
  </PressableCard>
);

const Content = ({ launcherId }) => {
  const refresh = useRefresh();
  const blocks = useRecoilValue(query(launcherId));

  const renderItem = ({ item }) => <Item item={item} />;

  if (blocks.results.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
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
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
        data={blocks.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.confirmed_block_index.toString()}
      />
    </SafeAreaView>
  );
};

const FarmerBlockScreen = ({ launcherId }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content launcherId={launcherId} />
  </Suspense>
);

const styles = StyleSheet.create({
  date: {
    marginLeft: 'auto',
    fontSize: 12,
  },
  block: {
    marginLeft: 'auto',
    fontSize: 14,
  },
  amount: {
    fontSize: 16,
  },
});

export default FarmerBlockScreen;
