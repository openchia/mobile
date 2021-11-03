import React, { Suspense, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControlBase,
  RefreshControl,
  TouchableNativeFeedback,
} from 'react-native';
import { selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { Text, TouchableRipple } from 'react-native-paper';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace, getFarmers } from '../Api';
import { formatBytes } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import { farmersRequestIDState } from '../Atoms';
import CustomCard from '../components/CustomCard';

const useRefresh = () => {
  const setRequestId = useSetRecoilState(farmersRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const farmersQuery = selectorFamily({
  key: 'farmersSelector',
  get:
    () =>
    async ({ get }) => {
      get(farmersRequestIDState());
      const response = await getFarmers();
      if (response.error) {
        throw response.error;
      }
      return response;
    },
});

const Item = ({ item, rank, onPress }) => (
  // <View style={{ borderRadius: 24, backgroundColor: '#F66', height: 48 }}>
  //   <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#AAF', true)}>
  //     <View style={{ hiehgt: 200 }}>
  //       <Text>{item.rank}</Text>
  //     </View>
  //   </TouchableNativeFeedback>
  // </View>
  <CustomCard onPress={onPress}>
    <Text style={styles.rank}>{rank}</Text>
    <Text numberOfLines={1} style={styles.name}>
      {item.name ? item.name : item.launcher_id}
    </Text>
    <Text style={styles.size}>{formatBytes(item.estimated_size)}</Text>
  </CustomCard>
);

const Content = ({ navigation }) => {
  const farmers = useRecoilValue(farmersQuery());
  const refresh = useRefresh();

  const renderItem = ({ item, index }) => (
    <Item
      item={item}
      rank={index}
      onPress={() => {
        navigation.navigate({
          name: 'Farmer Details',
          params: { launcherId: item.launcher_id, name: item.name },
        });
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={<View style={{ marginTop: 8 }} />}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
        data={farmers.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.launcher_id.toString()}
      />
    </SafeAreaView>
  );
};

const FarmersScreen = ({ navigation }) => (
  <Suspense fallback={<LoadingComponent />}>
    <Content navigation={navigation} />
  </Suspense>
);

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 6,
    display: 'flex',
    flexDirection: 'row',
  },
  rank: {
    fontSize: 14,
    marginEnd: 20,
  },
  name: {
    fontSize: 14,
    marginEnd: 20,
    color: '#407538',
    flex: 1,
  },
  size: {
    marginLeft: 'auto',
    fontSize: 14,
  },
});

export default FarmersScreen;
