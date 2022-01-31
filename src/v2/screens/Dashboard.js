/* eslint-disable no-nested-ternary */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  getBalanceFromAddresses,
  getFarmersFromLauncherIDAndStats,
  getPartialsFromIDs,
  getPayoutsFromAddresses,
} from '../../Api';
import {
  currencyState,
  farmErrorState,
  farmLoadingState,
  farmState,
  launcherIDsState,
} from '../../Atoms';
import { getCurrencyFromKey } from '../../screens/CurrencySelectionScreen';
import FarmersScreen from '../../screens/FarmersScreen';
import { formatBytes, formatPrice } from '../../utils/Formatting';
import FarmsScreen from './Farms';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FarmerStatsScreen from './farmer/Stats';
import FarmerPartialScreen from './farmer/Partials';
import PayoutScreen from '../../screens/PayoutScreen';
import FarmerPayoutScreen from './farmer/Payouts';
import FarmerBlockScreen from './farmer/Blocks';

const Tab = createMaterialTopTabNavigator();

const sumValue = (data, type) => data.map((item) => item[type]).reduce((a, b) => a + b);

const DashboardScreen = ({ navigation }) => {
  const farms = useRecoilValue(launcherIDsState);
  const [data, setData] = useRecoilState(farmState);
  const [loading, setLoading] = useRecoilState(farmLoadingState);
  const [error, setError] = useRecoilState(farmErrorState);
  const currency = useRecoilValue(currencyState);

  useEffect(() => {
    if (farms.length > 0) {
      setLoading((prev) => ({ ...prev, stats: true, partials: true, address: true }));
      let timestamp = new Date().getTime();
      timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
      const scannedAddresses = farms
        .filter((item) => item.token !== null)
        .map((item) => item.address);
      getBalanceFromAddresses(scannedAddresses)
        .then((response) => {
          setData((prev) => ({
            ...prev,
            balance: response.map((item) => item.data.unspentBalance).reduce((a, b) => a + b),
          }));
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, address: false }));
        });

      getFarmersFromLauncherIDAndStats(farms.map((item) => item.launcherId))
        .then(([farmers, stats]) => {
          setData((prev) => ({ ...prev, farmers, stats }));
        })
        .catch((error) => {
          setError((prev) => ({ ...prev, stats: true }));
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, stats: false }));
        });

      getPartialsFromIDs(
        farms.map((item) => item.launcherId),
        timestamp
      )
        .then((partials) => {
          setData((prev) => ({ ...prev, partials }));
        })
        .catch((error) => {
          setError((prev) => ({ ...prev, partials: true }));
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, partials: false }));
        });

      // getPayoutsFromAddresses(
      //   farms.map((item) => item.launcherId),
      //   timestamp
      // )
      //   .then((payouts) => {
      //     setData((prev) => ({ ...prev, payouts }));
      //   })
      //   .catch((error) => {
      //     setError((prev) => ({ ...prev, payouts: true }));
      //   })
      //   .finally(() => {
      //     setLoading((prev) => ({ ...prev, payouts: false }));
      //   });
    }
  }, [farms]);

  // console.log(Array.from(farms.entries())[0][1].name);
  const name = () => {
    if (farms.length === 1) {
      return farms[0].name;
    }
    return 'None';
  };

  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.onSurface }}>
      <View
        style={{
          backgroundColor: theme.colors.onSurfaceLight,
          alignItems: 'center',
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.onSurfaceLight,
            alignItems: 'center',
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <Text style={{ textAlign: 'right', paddingTop: 8, paddingRight: 16 }}>USD</Text>
        </View>
        <View
          style={{
            borderColor: 'grey',
            borderRadius: 24,
            borderWidth: 0.6,
            marginTop: 16,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              // color: theme.colors.textGrey,
              // padding: 2,
              paddingLeft: 16,
              // paddingRight: 16,
            }}
          >
            {name()}
          </Text>
          <Ionicons icon="plus" color="black" size={24} />
          <IconButton
            // style={{ backgroundColor: theme.colors.primary }}
            style={{ marginRight: 10, margin: 0 }}
            icon="chevron-down"
            size={16}
            // color={theme.colors.textGrey}
          />
        </View>

        <Text style={{ paddingTop: 16, fontSize: 24 }}>
          {loading.address ? '0 XCH' : `${data.balance.toFixed(2)} XCH`}
          {/* {loading.address ? '0 XCH' : `${4.8} XCH`} */}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            margin: 'auto',
            marginTop: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>Difficulty</Text>
            <Text style={{ textAlign: 'center' }}>
              {loading.stats ? '...' : sumValue(data.farmers, 'difficulty')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>
              Daily Earnings
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {loading.stats
                ? '...'
                : `${formatPrice(
                    (sumValue(data.farmers, 'estimated_size') / 1099511627776) *
                      data.stats.xch_tb_month *
                      data.stats.xch_current_price[currency],
                    currency
                  )}  ${getCurrencyFromKey(currency)}`}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>Size</Text>
            <Text style={{ textAlign: 'center' }}>
              {loading.stats ? '...' : formatBytes(sumValue(data.farmers, 'estimated_size'))}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: 1 }} />
      {farms.length > 0 ? (
        farms.length > 1 ? (
          <Tab.Navigator
            screenOptions={{
              // lazy: true,
              // lazyPreloadDistance: 0,
              tabBarLabelStyle: {
                fontFamily: theme.fonts.regular.fontFamily,
                // backgroundColor: theme.colors.tabNavigatorBackground,
              },
              tabBarStyle: {
                backgroundColor: theme.colors.tabNavigatorBackground,
              },
              // headerTintColor: theme.colors.tabNavigatorBackground,
            }}
          >
            <Tab.Screen name="Farms" component={FarmsScreen} />
            <Tab.Screen name="Stats" component={FarmersScreen} />
          </Tab.Navigator>
        ) : (
          <Tab.Navigator
            screenOptions={{
              // lazy: true,
              // lazyPreloadDistance: 0,
              tabBarLabelStyle: {
                fontFamily: theme.fonts.regular.fontFamily,
                // backgroundColor: theme.colors.tabNavigatorBackground,
              },
              tabBarStyle: {
                backgroundColor: theme.colors.tabNavigatorBackground,
              },
              // headerTintColor: theme.colors.tabNavigatorBackground,
            }}
          >
            <Tab.Screen name="Stats" component={FarmerStatsScreen} />
            <Tab.Screen name="Partials" component={FarmerPartialScreen} />
            <Tab.Screen name="Payouts" component={FarmerPayoutScreen} />
            <Tab.Screen name="Blocks" component={FarmerBlockScreen} />
            {/* <Tab.Screen name="Stats" component={FarmersScreen} /> */}
          </Tab.Navigator>
        )
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.divider,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>Add Farm To Dashboard</Text>
          <Text style={{ fontSize: 14, color: theme.colors.textGrey, paddingBottom: 16 }}>
            Shows all data relevent to your Farm.
          </Text>
          <IconButton
            style={{ backgroundColor: theme.colors.primary }}
            icon="plus"
            size={32}
            color={theme.colors.surface}
            onPress={() => {
              navigation.navigate('Verify Farm');
            }}
          />
        </View>
      )}

      {/* <Tab.Navigator
        screenOptions={{
          // lazy: true,
          // lazyPreloadDistance: 0,
          tabBarLabelStyle: {
            fontFamily: theme.fonts.regular.fontFamily,Th
            // backgroundColor: theme.colors.tabNavigatorBackground,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.tabNavigatorBackground,
          },
          // headerTintColor: theme.colors.tabNavigatorBackground,
        }}
      >
        <Tab.Screen name="Farms" component={FarmsScreen} />
        <Tab.Screen name="Stats" component={FarmersScreen} />
      </Tab.Navigator> */}
    </SafeAreaView>
  );
};

export default DashboardScreen;
