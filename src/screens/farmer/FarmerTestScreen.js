/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectorFamily, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import {
  getFarmer,
  getPartialsFromID,
  getStats,
  getFarmersFromLauncherID,
  getPartialsFromIDTest,
  getPartialsFromIDs,
  getFarmersFromLauncherIDAndStats,
} from '../../Api';
import {
  currencyState,
  farmerRefreshState,
  groupState,
  initialRouteState,
  launcherIDsState,
  settingsState,
} from '../../Atoms';
import IconButton from '../../components/IconButton';
import FarmerStatsScreen from './FarmerStatsScreen';
import FarmerStatsScreenTest from './FarmerStatsScreenTest';
import FarmerPartialScreen from './FarmerPartialScreen';
import FarmerPayoutScreen from './FarmerPayoutScreen';
import FarmerBlockScreen from './FarmerBlocksScreen';
import TicketIcon from './../../images/TicketIcon';
import TicketsScreen from './../giveaway/TicketsScreen';

const Tab = createMaterialBottomTabNavigator();

const query = selectorFamily({
  key: 'farmer',
  get:
    (data) =>
    async ({ get }) => {
      get(farmerRefreshState());
      let timestamp = new Date().getTime();
      timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
      // console.log(launcherIDs);
      const farmer = await getFarmersFromLauncherID(data.launcherIds);
      // console.log(farmer);
      const partials = await getPartialsFromIDs(data.launcherIds, timestamp);
      // console.log(partials);
      const stats = await getStats();
      const currency = get(currencyState);
      if (farmer.error) {
        console.log('Error 1');
        throw farmer.error;
      } else if (partials.error) {
        console.log('Error 2');
        throw partials.error;
      } else if (stats.error) {
        console.log('Error 3');
        throw stats.error;
      }
      return { farmer, stats, currency };
    },
});

export const getHeaderTitle = (route, t, name) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Stats';

  switch (routeName) {
    case 'Stats':
      // return `${t('farmerDetails')}`;
      return `${name || t('farmerDetails')}`;
    case 'Partial Chart':
      return `${t('partials')}`;
    case 'FarmerPayouts':
      return `${t('payouts')}`;
    case 'FarmerBlocks':
      return `${t('farmedBlocks')}`;
    case 'Tickets':
      return `${t('tickets')}`;
  }
};

const getData = (route, initialRoute) => {
  if (route.name === 'Farmer' || route.name === 'Farmer Drawer') {
    if (route.params) {
      return {
        launcherIds: [route.params.data.launcherId],
        names: [route.params.data.name],
      };
    }
    if (initialRoute.name === 'Farmer Drawer')
      return {
        launcherIds: [initialRoute.launcherId],
        names: [initialRoute.launcherName],
      };
  }
  if (route.name === 'Group' || route.name === 'Farmer Group') {
    // console.log(route.name, route.params, initialRoute);
    if (route.params) {
      return {
        launcherIds: route.params.data.map((item) => item.launcherId),
        names: route.params.data.map((item) => item.name),
      };
    }
    if (initialRoute.name === 'Farmer Group')
      return {
        launcherIds: initialRoute.data.map((item) => item.launcherId),
        names: initialRoute.data.map((item) => item.name),
      };
  }
  return {
    launcherIds: [],
    names: [],
  };
};

const FarmerTestScreen = ({ route, navigation }) => {
  const [launcherIds, setLauncherIDs] = useRecoilState(launcherIDsState);
  const [groups, setGroups] = useRecoilState(groupState);
  const [settings, setSettings] = useRecoilState(settingsState);
  const initialRoute = useRecoilValue(initialRouteState);
  const theme = useTheme();
  const { t } = useTranslation();
  const [farmerDataAndStats, setFarmerDataAndStats] = useState([]);
  const [farmerDataAndStatsState, setFarmerDataAndStatsState] = useState('loading');

  const [farmerPartials, setFarmerPartials] = useState([]);
  const [farmerPartialsState, setFarmerPartialsState] = useState('loading');
  const [isInGroup, setIsInGroup] = useState(false);

  // const dataLoadable = useRecoilValueLoadable(query(getData(route, initialRoute)));

  const data = getData(route, initialRoute);

  React.useLayoutEffect(() => {
    console.log('Called');
    navigation.setOptions({
      headerTitle: getHeaderTitle(
        route,
        t,
        route.name === 'Farmer' || route.name === 'Farmer Drawer'
          ? data.names[0]
          : settings.groupName
      ),
    });
  }, [navigation, route]);

  // Farmer Stats and Stats
  useEffect(() => {
    getFarmersFromLauncherIDAndStats(data.launcherIds)
      .then(([farmers, stats]) => {
        setFarmerDataAndStats({ farmers, stats });
        // console.log({ farmers, stats });
      })
      .catch((error) => {
        setFarmerDataAndStatsState('hasError');
      })
      .finally(() => {
        setFarmerDataAndStatsState('hasValue');
      });
  }, []);

  // Farmer Partials
  useEffect(() => {
    let timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
    getPartialsFromIDs(data.launcherIds, timestamp)
      .then((farmerPartials) => {
        setFarmerPartials(farmerPartials);
        // console.log({ farmers, stats });
      })
      .catch((error) => {
        setFarmerPartialsState('hasError');
      })
      .finally(() => {
        setFarmerPartialsState('hasValue');
      });
  }, []);

  // // useEffect(() => {
  // //   setState(dataLoadable.state);
  // // }, [dataLoadable.state]);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginEnd: -12,
          }}
        >
          {route.name === 'Farmer' || route.name === 'Farmer Drawer' ? (
            <>
              <IconButton
                icon={
                  <MaterialCommunityIcons
                    name={
                      groups.map((item) => item.launcherId).includes(data.launcherIds[0])
                        ? 'text-box-remove-outline'
                        : 'text-box-plus-outline'
                    }
                    size={24}
                    color="white"
                    onPress={() => {
                      showDialog();
                      // bottomSheetRef.current.open();
                    }}
                  />
                }
              />
              <IconButton
                icon={
                  <Ionicons
                    name={
                      launcherIds.has(data.launcherIds[0])
                        ? launcherIds.get(data.launcherIds[0]).token
                          ? 'ios-settings-outline'
                          : 'ios-trash-bin-outline'
                        : 'ios-save-outline'
                    }
                    size={24}
                    color="white"
                  />
                }
                style={{ marginEnd: 20 }}
                color="#fff"
                size={24}
                onPress={() => {
                  if (launcherIds.has(data.launcherIds[0])) {
                    // navigation.navigate('Farmer Settings');
                    const launcherData = launcherIds.get(data.launcherIds[0]);
                    // console.log(launcherData, launcherIds, data.launcherIds[0]);
                    if (launcherData.token) {
                      navigation.navigate({
                        name: 'Farmer Settings',
                        params: {
                          name: data.names[0],
                          launcherId: data.launcherIds[0],
                          token: launcherData.token,
                        },
                      });
                    } else {
                      setLauncherIDs((prev) => {
                        const newState = new Map(prev);
                        newState.delete(data.launcherIds[0]);
                        return newState;
                      });
                    }
                    // navigation.goBack();
                  } else {
                    setLauncherIDs(
                      (prev) =>
                        new Map(
                          prev.set(data.launcherIds[0], {
                            name: data.names[0],
                          })
                        )
                    );
                  }
                }}
              />
            </>
          ) : null}
        </View>
      ),
    });
  }, [navigation, route, launcherIds, groups]);

  if (data.launcherIds === null) return null;

  return (
    <>
      <Tab.Navigator
        labeled={false}
        activeColor={theme.colors.tabNavigatorText}
        barStyle={{ backgroundColor: theme.colors.tabNavigator }}
      >
        <Tab.Screen
          options={{
            style: {
              height: 45,
            },
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'chart-areaspline' : 'chart-line'}
                size={24}
                color={color}
              />
            ),
          }}
          name="Stats"
        >
          {() => (
            <FarmerStatsScreenTest
              farmerDataAndStats={farmerDataAndStats}
              farmerDataAndStatsState={farmerDataAndStatsState}
              farmerPartials={farmerPartials}
              farmerPartialsState={farmerPartialsState}
              launcherIds={data.launcherIds}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'ios-bar-chart' : 'ios-bar-chart-outline'}
                size={24}
                color={color}
              />
            ),
          }}
          name="Partial Chart"
        >
          {() => <FarmerPartialScreen launcherIds={data.launcherIds} />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'ios-card' : 'ios-card-outline'} size={24} color={color} />
            ),
          }}
          name="FarmerPayouts"
        >
          {() => <FarmerPayoutScreen launcherIds={data.launcherIds} />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'ios-layers' : 'ios-layers-outline'}
                size={24}
                color={color}
              />
            ),
          }}
          name="FarmerBlocks"
        >
          {() => <FarmerBlockScreen launcherIds={data.launcherIds} />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            style: {
              backgroundColor: 'red',
              height: 45,
            },
            tabBarIcon: ({ color, focused }) => (
              <TicketIcon
                size={24}
                color={color}
                filled={focused}
                greenColor={theme.colors.primary}
              />
            ),
          }}
          name="Tickets"
        >
          {() => <TicketsScreen launcherIds={data.launcherIds} />}
        </Tab.Screen>
      </Tab.Navigator>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Group Farm</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {groups.map((item) => item.launcherId).includes(data.launcherIds[0])
                ? 'Remove'
                : 'Add'}{' '}
              farm to group ?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color={theme.colors.primaryLight} onPress={hideDialog}>
              No
            </Button>
            <Button
              color={theme.colors.primaryLight}
              onPress={() => {
                if (groups.map((item) => item.launcherId).includes(data.launcherIds[0])) {
                  const items = groups.filter((item) => item.launcherId !== data.launcherIds[0]);
                  setGroups(items);
                } else {
                  setGroups((prev) => [
                    ...prev,
                    { name: data.names[0], launcherId: data.launcherIds[0] },
                  ]);
                }
                hideDialog();
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* <BottomSheet
        animateOnMount={false}
        enablePanDownToClose
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet> */}
    </>
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

export default FarmerTestScreen;
