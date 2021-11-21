/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { selectorFamily, useRecoilState, useRecoilValueLoadable } from 'recoil';
import { getFarmer, getPartialsFromID, getStats, updateFCMToken } from '../Api';
import { currencyState, farmerRefreshState, launcherIDsState } from '../Atoms';
import IconButton from '../components/IconButton';
import FarmerBlockScreen from './FarmerBlocksScreen';
import FarmerPartialScreen from './FarmerPartialScreen';
import FarmerPayoutScreen from './FarmerPayoutScreen';
import FarmerStatsScreen from './FarmerStatsScreen';

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

export const getHeaderTitle = (route, t) => {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Stats';
  // name={t('common:stats')}

  switch (routeName) {
    case 'Stats':
      return `${t('common:farmerDetails')}`;
    case 'Partial Chart':
      return `${t('common:partials')}`;
    case 'FarmerPayouts':
      return `${t('common:payouts')}`;
    case 'FarmerBlocks':
      return `${t('common:farmedBlocks')}`;
  }
};

const FarmerScreen = ({ route, navigation }) => {
  const [launcherIDs, setLauncherIDs] = useRecoilState(launcherIDsState);
  // const settings = useRecoilValue(settingsState);
  const { launcherId, name } = route.params;
  const dataLoadable = useRecoilValueLoadable(query(launcherId));

  useLayoutEffect(() => {
    // const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    navigation.setOptions({
      headerRight: (props) => (
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
              <Ionicons
                name={launcherIDs.has(launcherId) ? 'ios-trash-bin-outline' : 'ios-save-outline'}
                size={24}
                color="white"
              />
            }
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={() => {
              if (launcherIDs.has(launcherId)) {
                setLauncherIDs((prev) => {
                  const newState = new Map(prev);
                  const launcherData = prev.get(launcherId);
                  updateFCMToken(launcherId, launcherData.token, null).then((data) => {
                    console.log(`Successfully removed FCM Token for launcher ${launcherData.name}`);
                  });
                  newState.delete(launcherId);
                  // getObject('fcm').then((FCMToken) => {
                  //   // console.log(element);
                  //   // updateFCMToken(launcherId, launcherData.value.token, null).then((data) => {
                  //   //   console.log(data);
                  //   // });
                  // });
                  return newState;
                });
                navigation.goBack();
              } else {
                setLauncherIDs((prev) => new Map(prev.set(launcherId, { name })));
              }
            }}
          />
          {/* <Ionicons.Button
            name={launcherIDs.has(launcherId) ? 'ios-trash-bin-outline' : 'ios-save-outline'}
            style={{ marginEnd: 8 }}
            backgroundColor="transparent"
            color="#fff"
            size={24}
            onPress={() => {
              if (launcherIDs.has(launcherId)) {
                setLauncherIDs((prev) => {
                  const newState = new Map(prev);
                  const launcherData = prev.get(launcherId);
                  updateFCMToken(launcherId, launcherData.token, null).then((data) => {
                    console.log(`Successfully removed FCM Token for launcher ${launcherData.name}`);
                  });
                  newState.delete(launcherId);
                  // getObject('fcm').then((FCMToken) => {
                  //   // console.log(element);
                  //   // updateFCMToken(launcherId, launcherData.value.token, null).then((data) => {
                  //   //   console.log(data);
                  //   // });
                  // });
                  return newState;
                });
                navigation.goBack();
              } else {
                setLauncherIDs((prev) => new Map(prev.set(launcherId, { name })));
              }
            }}
          /> */}
          {/* <IconButton
            icon={launcherIDs.has(launcherId) ? 'delete' : 'content-save'}
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={() => {
              if (launcherIDs.has(launcherId)) {
                setLauncherIDs((prev) => {
                  const newState = new Map(prev);
                  const launcherData = prev.get(launcherId);
                  updateFCMToken(launcherId, launcherData.token, null).then((data) => {
                    console.log(`Successfully removed FCM Token for launcher ${launcherData.name}`);
                  });
                  newState.delete(launcherId);
                  // getObject('fcm').then((FCMToken) => {
                  //   // console.log(element);
                  //   // updateFCMToken(launcherId, launcherData.value.token, null).then((data) => {
                  //   //   console.log(data);
                  //   // });
                  // });
                  return newState;
                });
                navigation.goBack();
              } else {
                setLauncherIDs((prev) => new Map(prev.set(launcherId, { name })));
              }
            }}
          /> */}
        </View>
      ),
    });
  }, [navigation, route]);

  return (
    <Tab.Navigator labeled={false}>
      <Tab.Screen
        options={{
          style: {
            backgroundColor: 'red',
            height: 45,
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={24} color="white" />
          ),
        }}
        name="Stats"
      >
        {() => <FarmerStatsScreen launcherId={launcherId} dataLoadable={dataLoadable} />}
      </Tab.Screen>
      <Tab.Screen
        options={{
          style: {
            backgroundColor: 'red',
            height: 45,
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-bar-chart-outline" size={24} color="white" />
          ),
        }}
        name="Partial Chart"
      >
        {() => <FarmerPartialScreen launcherId={launcherId} dataLoadable={dataLoadable} />}
      </Tab.Screen>
      <Tab.Screen
        options={{
          style: {
            backgroundColor: 'red',
            height: 45,
          },
          tabBarIcon: ({ color }) => <Ionicons name="ios-card-outline" size={24} color="white" />,
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
          tabBarIcon: ({ color }) => <Ionicons name="ios-layers-outline" size={24} color="white" />,
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
