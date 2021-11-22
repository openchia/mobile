import { format, fromUnixTime } from 'date-fns';
import React, { Suspense, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
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

const Item = ({ item }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <PressableCard onTap={() => {}}>
      <View style={{ padding: 8, display: 'flex' }}>
        <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('common:effort')}</Text>
          <Text style={[styles.val, { fontWeight: 'bold' }]}>{`${item.luck}% ( ${getLuck(
            item.luck
          )} )`}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('common:index')}</Text>
          <Text style={styles.val}>{item.confirmed_block_index}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('common:farmer')}</Text>
          <Text numberOfLines={1} style={[styles.val, { color: theme.colors.textLight }]}>
            {item.farmed_by.name ? item.farmed_by.name : item.farmed_by.launcher_id}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={[styles.title, { color: theme.colors.textGrey }]}>{t('common:date')}</Text>
          <Text style={styles.val}>{format(fromUnixTime(item.timestamp), 'PPpp')}</Text>
        </View>
      </View>
    </PressableCard>
  );
};

const Content = ({ navigation }) => {
  const refresh = useRefresh();
  const refreshLoadable = useRecoilValueLoadable(query());
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshLoadable.state === 'hasValue') {
      setData(refreshLoadable.contents.results);
      setRefreshing(false);
    }
  }, [refreshLoadable.contents]);

  const renderItem = ({ item, index }) => <Item item={item} />;

  if (refreshLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
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

const BlocksFoundScreen = ({ navigation }) => {
  const refresh = useRefresh();
  const refreshLoadable = useRecoilValueLoadable(query());
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshLoadable.state === 'hasValue') {
      setData(refreshLoadable.contents.results);
      setRefreshing(false);
    }
  }, [refreshLoadable.contents]);

  const renderItem = ({ item, index }) => <Item item={item} />;

  if (refreshLoadable.state === 'loading' && !refreshing) {
    return <LoadingComponent />;
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
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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

export default BlocksFoundScreen;
