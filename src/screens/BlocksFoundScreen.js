import { format, fromUnixTime } from 'date-fns';
import React, { Suspense } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
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
          <Text style={styles.title}>{t('common:effort')}:</Text>
          <Text style={[styles.val, { fontWeight: 'bold' }]}>{`${item.luck}% ( ${getLuck(
            item.luck
          )} )`}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={styles.title}>{t('common:index')}:</Text>
          <Text style={styles.val}>{item.confirmed_block_index}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={styles.title}>{t('common:farmer')}:</Text>
          <Text numberOfLines={1} style={[styles.val, { color: theme.colors.textLight }]}>
            {item.farmed_by.name ? item.farmed_by.name : item.farmed_by.launcher_id}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Text style={styles.title}>{t('common:date')}:</Text>
          <Text style={styles.val}>{format(fromUnixTime(item.timestamp), 'PPpp')}</Text>
        </View>
      </View>
    </PressableCard>
  );
};

const Content = ({ navigation }) => {
  const refresh = useRefresh();
  const blocks = useRecoilValue(query());

  const renderItem = ({ item, index }) => <Item item={item} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 6 }}
        ListHeaderComponent={<View style={{ paddingTop: 6 }} />}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
        data={blocks.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.name.toString()}
      />
    </SafeAreaView>
  );
};

const BlocksFoundScreen = ({ navigation }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content />
  </Suspense>
);

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
