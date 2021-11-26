import { format } from 'date-fns';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValue, useSetRecoilState, useRecoilValueLoadable } from 'recoil';
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

// const Item = ({ item }) => (
//   <PressableCard onTap={() => {}}>
//     <View
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//       }}
//     >
//       {/* <Text style={styles.rank}>{item.transaction}</Text> */}
//       <Text style={styles.amount}>{`${convertMojoToChia(item.amount)} XCH`}</Text>
//       <View style={{ flex: 1 }} />
//       <View style={{ display: 'flex', flexDirection: 'column' }}>
//         <Text style={styles.block}>{item.confirmed_block_index}</Text>
//         <Text style={styles.date}>{format(new Date(item.payout.datetime), 'PPpp')}</Text>
//       </View>
//     </View>
//   </PressableCard>
// );

const Item = ({ item, theme, t }) => (
  <PressableCard onTap={() => {}}>
    <View style={{ display: 'flex', flexDirection: 'column', padding: 8, flex: 1 }}>
      {/* <Text style={styles.rank}>{item.id}</Text>
      <Text style={styles.date}>{format(new Date(item.datetime), 'PPpp')}</Text>
      <Text style={styles.size}>{`${convertMojoToChia(item.amount)} XCH`}</Text> */}

      {/* <View style={{ padding: 8, display: 'flex' }}> */}
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

const Content = ({ launcherId }) => {
  const refresh = useRefresh();
  const payoutsLoadable = useRecoilValueLoadable(query(launcherId));
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const theme = useTheme();
  // console.log(payouts.results);

  useEffect(() => {
    if (payoutsLoadable.state === 'hasValue') {
      setData(payoutsLoadable.contents.results);
      setRefreshing(false);
    }
  }, [payoutsLoadable.state]);

  const renderItem = ({ item }) => <Item item={item} theme={theme} t={t} />;

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
        <Text style={{ marginEnd: 16, fontSize: 16 }}>{t('totalChiaAccumulated')}</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'right', flex: 1 }}>
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

const FarmerPayoutScreen = ({ navigation, launcherId }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content launcherId={launcherId} />
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
