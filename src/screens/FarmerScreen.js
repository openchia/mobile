/* eslint-disable no-nested-ternary */
import React, { Suspense, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  selectorFamily,
  useRecoilValue,
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { format } from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { IconButton, Text } from 'react-native-paper';
import { getNetspace, getFarmers, getPartialsFromID, getFarmer, getStats } from '../Api';
import { formatBytes, formatPrice } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import FarmerGraphScreen from './FarmerGraphScreen';
import { saveObject } from '../utils/Utils';
import { currencyState, farmerRequestIDState, launcherIDsState } from '../Atoms';
import CustomCard from '../components/CustomCard';
import { getCurrencyFromKey } from './CurrencySelectionScreen';

const Tab = createMaterialBottomTabNavigator();

const Item = ({ title, value, color, loadable, format }) => (
  <CustomCard style={styles.item}>
    <Text style={{ color, fontSize: 16, textAlign: 'center' }}>{title}</Text>
    <Text
      style={{
        textAlign: 'center',
        // marginTop: 10,
        // marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
      }}
    >
      {loadable.state === 'hasValue' ? format(loadable.contents.partials) : '...'}
    </Text>
  </CustomCard>
);

const HeaderItem = ({ loadable, launcherId, currency }) => (
  <CustomCard style={styles.headerItem}>
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Friendly Name:</Text>
      <Text>
        {loadable.state === 'hasValue'
          ? loadable.contents.farmer.name
            ? loadable.contents.farmer.name
            : 'None'
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'column', marginTop: 6 }}>
      <Text style={{ fontWeight: 'bold' }}>Launcher ID:</Text>
      <TouchableOpacity
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}
        onPress={() => Clipboard.setString(launcherId)}
      >
        <Text style={{ textAlign: 'center', marginEnd: 16 }}>{launcherId}</Text>
        <MaterialCommunityIcons name="content-copy" size={16} color="grey" />
      </TouchableOpacity>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Difficulty:</Text>
      <Text style={{}}>
        {loadable.state === 'hasValue' ? loadable.contents.farmer.difficulty : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Joined At:</Text>
      {/* <Text style={{}}>{format(new Date(item.joined_at), 'PPpp')}</Text> */}
      <Text style={{}}>
        {loadable.state === 'hasValue'
          ? format(new Date(loadable.contents.farmer.joined_at), 'PPpp')
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Estimated Daily Earnings:</Text>
      <Text>
        {loadable.state === 'hasValue'
          ? `${formatPrice(
              (loadable.contents.farmer.estimated_size / 1099511627776) *
                loadable.contents.stats.xch_tb_month *
                loadable.contents.stats.xch_current_price[currency],
              currency
            )}  ${getCurrencyFromKey(currency)}`
          : '...'}
      </Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Points:</Text>
      <Text>{loadable.state === 'hasValue' ? loadable.contents.farmer.points : '...'}</Text>
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Utilization Space:</Text>
      <Text>
        {loadable.state === 'hasValue'
          ? `${loadable.contents.farmer.points_of_total.toFixed(5)}%`
          : '...'}
      </Text>
      {/* <Text style={{}}>{formatBytes(item.estimated_size)}</Text> */}
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 6 }}>
      <Text style={{ flex: 1, fontWeight: 'bold' }}>Estimated Size:</Text>
      <Text>
        {loadable.state === 'hasValue'
          ? formatBytes(loadable.contents.farmer.estimated_size)
          : '...'}
      </Text>
      {/* <Text style={{}}>{formatBytes(item.estimated_size)}</Text> */}
    </View>
  </CustomCard>
);

const useRefresh = () => {
  const setRequestId = useSetRecoilState(farmerRequestIDState());
  return () => setRequestId((id) => id + 1);
};

const query = selectorFamily({
  key: 'farmersSelector',
  get:
    (launcherID) =>
    async ({ get }) => {
      get(farmerRequestIDState());
      let timestamp = new Date().getTime();
      timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
      const farmer = await getFarmer(launcherID);
      const partials = await getPartialsFromID(launcherID, timestamp);
      const stats = await getStats();
      if (partials.error) {
        throw partials.error;
      } else if (farmer.error) {
        throw farmer.error;
      }
      return { farmer, partials, stats };
    },
});

const Content = ({ launcherId }) => {
  // const { item } = route.params;
  // const partials = useRecoilValue(query(item.launcher_id));
  const refresh = useRefresh();
  const dataLoadable = useRecoilValueLoadable(query(launcherId));
  const currency = useRecoilValue(currencyState);

  // const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  const errors = [];
  const harvesters = new Set();
  let points = 0;

  // partialsFiltered = partials.results.filter((item) => item.error !== null);

  if (dataLoadable.state === 'hasValue') {
    dataLoadable.contents.partials.results.forEach((item) => {
      harvesters.add(item.harvester_id);
      if (item.error !== null) {
        errors.push(errors);
      } else {
        points += item.difficulty;
      }
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 4, flex: 1, display: 'flex' }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => refresh()} />}
      >
        <HeaderItem loadable={dataLoadable} launcherId={launcherId} currency={currency} />
        <View style={styles.container}>
          <Item
            loadable={dataLoadable}
            format={(item) => item.count}
            color="#4DB33E"
            title={`PARTIALS\n(24 HOURS)`}
          />
          <Item
            loadable={dataLoadable}
            format={() => points}
            color="#4DB33E"
            title={'POINTS\n(24 HOURS)'}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={dataLoadable}
            format={(item) => item.count - errors.length}
            color="#3DD292"
            title={`SUCCESSFUL\nPARTIALS`}
          />
          <Item
            loadable={dataLoadable}
            format={() => errors.length}
            color="#FB6D4C"
            title={'FAILED\nPARTIALS'}
          />
        </View>
        <View style={styles.container}>
          <Item
            loadable={dataLoadable}
            format={(item) => `${(((item.count - errors.length) * 100) / item.count).toFixed(1)}%`}
            color="#34D4F1"
            title={'PARTIAL\nPERFORMANCE'}
          />
          <Item
            loadable={dataLoadable}
            format={() => harvesters.size}
            color="#34D4F1"
            title={'HARVESTERS\nCOUNT'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const FarmerScreen = ({ route, navigation }) => {
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  // const [loading, setLoading] = useState(true);
  const { launcherId, name } = route.params;
  // const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  // const [launcherItem, setLauncherItem] = useState(item || null);

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
            icon={
              // eslint-disable-next-line no-nested-ternary
              launcherIDs.has(launcherId) ? 'delete' : 'content-save'
            }
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={() => {
              if (launcherIDs.has(launcherId)) {
                setLauncherIDs((prev) => {
                  const newState = new Map(prev);
                  newState.delete(launcherId);
                  return newState;
                });
                navigation.goBack();
              } else {
                setLauncherIDs((prev) => new Map(prev.set(launcherId, name)));
              }
            }}
          />
        </View>
      ),
    });
  }, [navigation]);

  // useEffect(() => {
  //   if (launcherID) {
  //     getFarmer(launcherID)
  //       .then((data) => {
  //         setLauncherItem(data);
  //       })
  //       .catch((error) => console.log(error))
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, []);

  // if (!launcherItem && launcherID && loading) {
  //   return <LoadingComponent />;
  // }

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Tab.Navigator labeled={false}>
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="file-chart" size={24} color="white" />
            ),
          }}
          name="Stats"
        >
          {() => <Content launcherId={launcherId} />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="chart-areaspline-variant" size={24} color="white" />
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
    display: 'flex',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  headerItem: {
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 6,
  },
});

export default FarmerScreen;
