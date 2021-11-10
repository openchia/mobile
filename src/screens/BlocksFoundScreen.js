import React, { Suspense, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { format, fromUnixTime } from 'date-fns';
import { Text, useTheme } from 'react-native-paper';
import { getBlocks, getNetspace } from '../Api';
import { formatBytes } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import { blocksRequestIDState } from '../Atoms';
import CustomCard from '../components/CustomCard';
import PressableCard from '../components/PressableCard';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(blocksRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'farmersSelector',
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

const Item = ({ item }) => {
  const theme = useTheme();
  return (
    <PressableCard onTap={() => {}}>
      <View
        style={{ padding: 8, display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center' }}
      >
        <View style={{ marginEnd: 20 }}>
          <Text style={styles.index}>{item.confirmed_block_index}</Text>
          <Text style={styles.date}>{format(fromUnixTime(item.timestamp), 'PPpp')}</Text>
        </View>
        {/* <Text style={styles.luck}>{`${item.luck}%`}</Text> */}
        <Text numberOfLines={1} style={[styles.name, { color: theme.colors.textLight }]}>
          {item.farmed_by.name ? item.farmed_by.name : item.farmed_by.launcher_id}
        </Text>
      </View>
    </PressableCard>
  );
};

const Content = ({ navigation }) => {
  const refresh = useRefresh();
  const blocks = useRecoilValue(query());

  const renderItem = ({ item, index }) => <Item item={item} />;

  return (
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={<View style={{ marginTop: 8 }} />}
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
  index: {
    fontSize: 14,
    marginEnd: 20,
  },
  date: {
    fontSize: 10,
    marginEnd: 20,
  },
  name: {
    fontSize: 14,
    marginLeft: 'auto',
    textAlign: 'right',
    flex: 1,
  },
  luck: {
    fontSize: 14,
    marginEnd: 20,
  },
});

export default BlocksFoundScreen;
