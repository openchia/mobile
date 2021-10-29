import React, { Suspense, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { selectorFamily, useRecoilValue } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace, getFarmers } from '../Api';
import { formatBytes } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import FarmerScreen from './FarmerScreen';

const farmersQuery = selectorFamily({
  key: 'farmersSelector',
  get: () => async () => {
    const response = await getFarmers();
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const Item = ({ item, rank, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.rank}>{rank}</Text>
    <Text numberOfLines={1} style={styles.name}>
      {item.name ? item.name : item.launcher_id}
    </Text>
    <Text style={styles.size}>{formatBytes(item.estimated_size)}</Text>
  </TouchableOpacity>
);

const Content = ({ navigation }) => {
  const farmers = useRecoilValue(farmersQuery());

  const renderItem = ({ item, index }) => (
    <Item
      item={item}
      rank={index}
      onPress={() => {
        console.log('Clicked');
        navigation.navigate('Farmer');
      }}
    />
  );

  return (
    <SafeAreaView>
      <FlatList
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
    {/* <Stack.Navigator>
      <Stack.Screen name="List" component={Content} options={{ headerShown: false }} />
      <Stack.Screen
        name="Item"
        component={FarmerScreen}
        options={{ headerShown: false, title: 'hello' }}
      />
    </Stack.Navigator> */}
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
