import { format } from 'date-fns';
import React, { Suspense } from 'react';
import { FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { getPayoutsFromAddress } from '../../Api';
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
    (launcherId) =>
    async ({ get }) => {
      get(farmerPayoutsRefreshState());
      const response = await getPayoutsFromAddress(launcherId);
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
        <Text style={styles.date}>{format(new Date(item.payout.datetime), 'PPpp')}</Text>
      </View>
    </View>
  </PressableCard>
);

const Content = ({ launcherId }) => {
  const refresh = useRefresh();
  const payouts = useRecoilValue(query(launcherId));

  // console.log(payouts.results);

  const renderItem = ({ item }) => <Item item={item} />;

  if (payouts.results.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
      >
        <Text style={{ textAlign: 'center', fontSize: 30, padding: 10 }}>
          No payouts received yet. Pull down to refresh.
        </Text>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={<View style={{ marginTop: 6 }} />}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
        data={payouts.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const FarmerPayoutScreen = ({ navigation, launcherId }) => (
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
    fontSize: 14,
  },
});

export default FarmerPayoutScreen;
