/* eslint-disable default-case */
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
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { getNetspace, getFarmers, getPartialsFromID, getFarmer, getStats } from '../Api';
import { formatBytes, formatPrice } from '../utils/Formatting';
import LoadingComponent from '../components/LoadingComponent';
import FarmerGraphScreen from './FarmerGraphScreen';
import { saveObject } from '../utils/Utils';
import { currencyState, farmerRefreshState, launcherIDsState } from '../Atoms';
import CustomCard from '../components/CustomCard';
import { getCurrencyFromKey } from './CurrencySelectionScreen';
import FarmerStatsScreen from './FarmerStatsScreen';
import FarmerPayoutScreen from './FarmerPayoutScreen';
import FarmerBlockScreen from './FarmerBlocksScreen';

const Tab = createMaterialBottomTabNavigator();

const query = selectorFamily({
  key: 'farmer',
  get:
    (launcherID) =>
    async ({ get }) => {
      get(farmerRefreshState());
      let timestamp = new Date().getTime();
      timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
      const farmer = await getFarmer(launcherID);
      const partials = await getPartialsFromID(launcherID, timestamp);
      const stats = await getStats();
      const currency = get(currencyState);
      if (partials.error) {
        throw partials.error;
      } else if (farmer.error) {
        throw farmer.error;
      }
      return { farmer, partials, stats, currency };
    },
});

export const getHeaderTitle = (route) => {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Stats';

  switch (routeName) {
    case 'Stats':
      return 'Launcher ID Stats';
    case 'FarmerPayouts':
      return 'Payouts';
    case 'FarmerBlocks':
      return 'Farmed Blocks';
  }
};

const FarmerScreen = ({ route, navigation }) => {
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  const { launcherId, name } = route.params;
  const dataLoadable = useRecoilValueLoadable(query(launcherId));

  React.useLayoutEffect(() => {
    navigation.setOptions(({ route }) => ({
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
            icon={launcherIDs.has(launcherId) ? 'delete' : 'content-save'}
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
    }));
  }, [navigation]);

  return (
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
        {() => <FarmerStatsScreen launcherId={launcherId} dataLoadable={dataLoadable} />}
      </Tab.Screen>
      {/* <Tab.Screen
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
      /> */}
      <Tab.Screen
        options={{
          style: {
            backgroundColor: 'red',
            height: 45,
          },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash-multiple" size={24} color="white" />
          ),
        }}
        name="FarmerPayouts"
      >
        {() => <FarmerPayoutScreen launcherId={launcherId} dataLoadable={dataLoadable} />}
      </Tab.Screen>
      <Tab.Screen
        options={{
          style: {
            backgroundColor: 'red',
            height: 45,
          },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="shape-square-plus" size={24} color="white" />
          ),
        }}
        name="FarmerBlocks"
      >
        {() => <FarmerBlockScreen launcherId={launcherId} dataLoadable={dataLoadable} />}
      </Tab.Screen>
    </Tab.Navigator>
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
