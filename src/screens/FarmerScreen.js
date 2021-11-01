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
import { selectorFamily, useRecoilValue, useRecoilState } from 'recoil';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { format } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { IconButton } from 'react-native-paper';
import AreaChartNetspace from '../charts/AreaChartNetspace';
import { getNetspace, getFarmers, getPartialsFromID } from '../Api';
import { formatBytes } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import FarmerGraphScreen from './FarmerGraphScreen';
import { saveObject } from '../utils/Utils';
import { launcherIDsState } from '../Atoms';

const Tab = createMaterialBottomTabNavigator();
// const Tab = createBottomTabNavigator();

const Item = ({ title, value, color }) => (
  <View style={styles.item}>
    <Text style={{ color, textAlign: 'center' }}>{title}</Text>
    <Text
      style={{
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
      }}
    >
      {value}
    </Text>
  </View>
);

const HeaderItem = ({ item }) => (
  <View style={styles.headerItem}>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Friendly Name:</Text>
      <Text style={{}}>{item.name ? item.name : 'None'}</Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      <Text style={{ fontWeight: 'bold' }}>Launcher ID:</Text>
      <TouchableOpacity
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}
        onPress={() => Clipboard.setString(item.launcher_id)}
      >
        <Text style={{ textAlign: 'center', marginEnd: 16 }}>{item.launcher_id}</Text>
        <MaterialCommunityIcons name="content-copy" size={16} color="grey" />
      </TouchableOpacity>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Difficulty:</Text>
      <Text style={{}}>{item.difficulty}</Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Joined At:</Text>
      <Text style={{}}>{format(new Date(item.joined_at), 'PPpp')}</Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Points</Text>
      <Text style={{}}>{item.points}</Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Estimated Size</Text>
      <Text style={{}}>{formatBytes(item.estimated_size)}</Text>
    </View>
  </View>
);

const query = selectorFamily({
  key: 'farmersSelector',
  get: (launcherID) => async () => {
    // console.log(launcherID);
    let timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
    const response = await getPartialsFromID(launcherID, timestamp);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

const Content = ({ item }) => {
  // const { item } = route.params;
  const partials = useRecoilValue(query(item.launcher_id));
  const partialsFiltered = [];
  const errors = [];
  const harvesters = new Set();
  let points = 0;

  // partialsFiltered = partials.results.filter((item) => item.error !== null);

  partials.results.forEach((item) => {
    harvesters.add(item.harvester_id);
    if (item.error !== null) {
      errors.push(errors);
    } else {
      points += item.difficulty;
    }
  });

  // console.log(partials);

  // console.log(partials);

  return (
    <SafeAreaView style={{ flex: 1, display: 'flex', marginTop: 16, marginBottom: 10 }}>
      <HeaderItem item={item} />
      <View style={styles.container}>
        <Item value={partials.count} color="#4DB33E" title={`PARTIALS\n(24 HOURS)`} />
        <Item value={points} color="#4DB33E" title={'POINTS\n(24 HOURS)'} />
      </View>
      <View style={styles.container}>
        <Item
          value={partials.count - errors.length}
          color="#3DD292"
          title={`SUCCESSFUL\nPARTIALS`}
        />
        <Item value={errors.length} color="#FB6D4C" title={'FAILED\nPARTIALS'} />
      </View>
      <View style={styles.container}>
        <Item
          value={`${(((partials.count - errors.length) * 100) / partials.count).toFixed(1)}%`}
          color="#34D4F1"
          title={'PARTIAL\nPERFORMANCE'}
        />
        <Item value={harvesters.size} color="#34D4F1" title={'HARVESTERS\nCOUNT'} />
      </View>
    </SafeAreaView>
  );
};
const FarmerScreen = ({ route, navigation }) => {
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const { item } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginEnd: -12,
            alignItems: 'center',
          }}
        >
          <IconButton
            icon="content-save"
            size={24}
            onPress={() => {
              // saveObject('launcherIDs', 'null');
              // const set = launcherIDs;
              // set.add(item.launcher_id);
              setLauncherIDs((prev) => new Map(prev.set(item.launcher_id, item.name)));
              // setLauncherIDs((prev) => new Map(prev.add(item.launcher_id)));
              // setLauncherIDs(set);
              // setLauncherIDs((prevState) => ({
              //   arrayvar: [...prevState.arrayvar, item.launcher_id],
              // }));
            }}
          />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Tab.Navigator
        tabBarOptions={
          {
            // showLabel: false,
          }
        }
        labeled={false}
      >
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="file-chart"
                size={24}
                color="white"
                style={
                  {
                    // marginTop: -5,
                  }
                }
              />
            ),
          }}
          name="Stats"
        >
          {() => <Content item={item} />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="chart-areaspline-variant"
                size={24}
                color="white"
                style={
                  {
                    // marginTop: -5,
                  }
                }
              />
            ),
          }}
          name="Settings"
          component={FarmerGraphScreen}
        />
      </Tab.Navigator>
    </Suspense>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    // flexWrap: 'wrap',
    display: 'flex',
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 6,
    marginHorizontal: 10,
    // marginStart: 16,
    //= = margin: 10,
    // margin: 6,
    // marginEnd: 10,
    // marginStart: 10,
    // height: 86,
    borderRadius: 8,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  headerItem: {
    display: 'flex',
    padding: 10,
    marginHorizontal: 10,
    // marginTop: 20,
    // flex: 1,
    backgroundColor: '#fff',
    elevation: 6,
    // margin: 6,
    marginBottom: 8,
    // marginStart: 10,
    // height: 200,
    borderRadius: 8,
    borderColor: '#fff', // if you need
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
});

export default FarmerScreen;
