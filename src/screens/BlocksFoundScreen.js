import { useNetInfo } from '@react-native-community/netinfo';
import { format, fromUnixTime } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getBlocks } from '../Api';
import { blocksRequestIDState } from '../Atoms';
import LoadingComponent from '../components/LoadingComponent';
import PressableCard from '../components/PressableCard';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(blocksRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'blocks',
  get:
    () =>
    async ({ get }) => {
      get(blocksRequestIDState());
      const response = await getBlocks();
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const getLuck = (luck) => {
  if (luck <= 30) {
    return 'Very Lucky';
  }
  if (luck <= 80) {
    return 'Lucky';
  }
  if (luck <= 120) {
    return 'Average';
  }
  if (luck <= 200) {
    return 'Unlucky';
  }
  return 'Very Unlucky';
};

const Item = ({ item, theme, t }) => (
  <PressableCard style={{ padding: 8, display: 'flex' }} onTap={() => {}}>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('effort')}
      </Text>
      <Text numberOfLines={1} style={[styles.val, { fontWeight: 'bold' }]}>{`${
        item.luck
      }% ( ${getLuck(item.luck)} )`}</Text>
    </View>
    <View style={{ flexDirection: 'row', marginTop: 8 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('index')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {item.confirmed_block_index}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', marginTop: 8 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('farmer')}
      </Text>
      <Text numberOfLines={1} style={[styles.val, { color: theme.colors.textLight }]}>
        {item.farmed_by.name ? item.farmed_by.name : item.farmed_by.launcher_id}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', marginTop: 8 }}>
      <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textGrey }]}>
        {t('date')}
      </Text>
      <Text numberOfLines={1} style={styles.val}>
        {format(fromUnixTime(item.timestamp), 'PPpp')}
      </Text>
    </View>
  </PressableCard>
);

const BlocksFoundScreen = () => {
  const refresh = useRefresh();
  const refreshLoadable = useRecoilValueLoadable(query());
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const netInfo = useNetInfo();
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (refreshLoadable.state === 'hasValue') {
      setData(refreshLoadable.contents.results);
      setRefreshing(false);
    }
  }, [refreshLoadable]);

  const renderItem = ({ item }) => <Item item={item} theme={theme} t={t} />;

  if (refreshLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
  }

  if (refreshLoadable.state === 'hasError') {
    return (
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', paddingBottom: 16 }}>
          Cant Connect to Network
        </Text>
        <Button
          mode="contained"
          onPress={() => {
            if (netInfo.isConnected) {
              refresh();
            }
          }}
        >
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
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
        keyExtractor={(item) => item.name.toString()}
      />
    </SafeAreaView>
  );
};

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

export default BlocksFoundScreen;
