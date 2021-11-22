import { format } from 'date-fns';
import React, { Suspense } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { getPayouts } from '../Api';
import { payoutsRequestIDState } from '../Atoms';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';
import { convertMojoToChia } from '../utils/Formatting';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(payoutsRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'payouts',
  get:
    () =>
    async ({ get }) => {
      get(payoutsRequestIDState());
      const response = await getPayouts();
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <PressableCard onTap={() => {}}>
      <View style={{ display: 'flex', flexDirection: 'column', padding: 8, flex: 1 }}>
        {/* <Text style={styles.rank}>{item.id}</Text>
      <Text style={styles.date}>{format(new Date(item.datetime), 'PPpp')}</Text>
      <Text style={styles.size}>{`${convertMojoToChia(item.amount)} XCH`}</Text> */}

        {/* <View style={{ padding: 8, display: 'flex' }}> */}
        <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('common:amount')}</Text>
          <Text style={[styles.val, { fontWeight: 'bold' }]}>{`${convertMojoToChia(
            item.amount
          )} XCH`}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('common:id')}</Text>
          <Text style={styles.val}>{item.id}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('common:date')}</Text>
          <Text style={styles.val}>{format(new Date(item.datetime), 'PPpp')}</Text>
        </View>
      </View>
      {/* </View> */}
    </PressableCard>
  );
};

const Content = () => {
  const refresh = useRefresh();
  const payouts = useRecoilValue(query());

  const renderItem = ({ item, index }) => <Item item={item} rank={index} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
        data={payouts.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const PayoutScreen = ({ navigation }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content />
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

export default PayoutScreen;
