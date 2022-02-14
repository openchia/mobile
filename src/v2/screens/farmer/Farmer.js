/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getFarmerStats, getPartialsFromID, getPartialsFromIDs } from '../../../Api';
import {
  farmErrorState,
  farmState,
  farmLoadingState,
  currencyState,
  farmStateFarmer,
  launcherIDsState,
} from '../../../Atoms';
import { getCurrencyFromKey } from '../../../screens/CurrencySelectionScreen';
import { formatBytes, formatPrice } from '../../../utils/Formatting';
import FarmerStatsScreen from './Stats';
import FarmerPartialScreen from './Partials';
import FarmerPayoutScreen from './Payouts';
import FarmerBlockScreen from './Blocks';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFarmersFromLauncherIDAndStats } from './../../../Api';
import { useTranslation } from 'react-i18next';
import CustomIconButton from '../../../components/CustomIconButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useIsMounted from '../../../hooks/useIsMounted';

const Tab = createMaterialTopTabNavigator();
const sumValue = (data, type) => data.map((item) => item[type]).reduce((a, b) => a + b);
const partialPerfomance = (partialCount, failedPartialCount) =>
  ((partialCount - failedPartialCount) * 100) / partialCount;

const FarmerScreen = ({ route, navigation }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({
    address: true,
    stats: true,
    partials: true,
    payouts: true,
  });
  const [error, setError] = useState({
    address: false,
    stats: false,
    partials: false,
    payouts: false,
  });
  const currency = useRecoilValue(currencyState);
  const [launcherId, setLauncherId] = useState(route.params.launcherId);
  const [name, setName] = useState(route.params.name);
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted.current)
      setLoading((prev) => ({ ...prev, stats: true, partials: true, address: true }));
    let timestamp = new Date().getTime();
    timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;

    getFarmersFromLauncherIDAndStats([launcherId])
      .then(([farmers, stats]) => {
        if (isMounted.current) setData((prev) => ({ ...prev, farmers, stats }));
      })
      .catch((error) => {
        setError((prev) => ({ ...prev, stats: true }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, stats: false }));
      });

    getPartialsFromIDs([launcherId], timestamp)
      .then((partials) => {
        if (isMounted.current) {
          const harvesters = new Set();
          const failedPartials = [];
          const successfulPartials = [];
          let partialCount = 0;
          let points = 0;

          partials[0].data.forEach((item) => {
            harvesters.add(item.harvester_id);
            if (item.error !== null) {
              failedPartials.push(item);
            } else {
              successfulPartials.push(item);
              points += item.difficulty;
            }
            partialCount += 1;
          });

          setData((prev) => ({
            ...prev,
            partials: {
              harvesters,
              failedPartials,
              successfulPartials,
              points,
              partialCount,
              partialPerfomance: partialPerfomance(partialCount, failedPartials.length),
            },
          }));
        }
      })
      .catch((error) => {
        if (isMounted.current) setError((prev) => ({ ...prev, partials: true }));
      })
      .finally(() => {
        if (isMounted.current) setLoading((prev) => ({ ...prev, partials: false }));
      });
  }, []);

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
            left: 0,
            top: 0,
          }}
        >
          <CustomIconButton
            icon={
              Platform.OS === 'ios' ? (
                <Ionicons name="ios-chevron-back-sharp" size={24} color={theme.colors.text} />
              ) : (
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
              )
            }
            style={{ marginEnd: 20 }}
            color="#fff"
            size={24}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        {/* {farm ? (
          farm.token === null ? (
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
              <CustomIconButton
                icon={<AntDesign name="staro" size={24} color={theme.colors.text} />}
                style={{ marginEnd: 8 }}
                color="#fff"
                size={24}
                onPress={() => {
                  if (!launcherIDs.map((item) => item.launcherId).includes(launcherId)) {
                    setLauncherIDs((prev) => [
                      ...prev,
                      {
                        launcherId,
                        name,
                        token: null,
                        address: null,
                      },
                    ]);
                  } else {
                    const newData = launcherIDs.filter((item) => item.launcherId !== launcherId);
                    setLauncherIDs(newData);
                  }
                }}
              />
            </View>
          ) : null
        ) : (
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
            <CustomIconButton
              icon={<AntDesign name="staro" size={24} color={theme.colors.text} />}
              style={{ marginEnd: 8 }}
              color="#fff"
              size={24}
              onPress={() => {
                if (!launcherIDs.map((item) => item.launcherId).includes(launcherId)) {
                  setLauncherIDs((prev) => [
                    ...prev,
                    {
                      launcherId,
                      name,
                      token: null,
                      address: null,
                    },
                  ]);
                } else {
                  const newData = launcherIDs.filter((item) => item.launcherId !== launcherId);
                  setLauncherIDs(newData);
                }
              }}
            />
          </View>
        )} */}

        <Text
          numberOfLines={1}
          style={{
            paddingTop: 24,
            fontSize: 20,
            // color: theme.colors.textGrey,
            // padding: 2,
            marginLeft: 48,
            marginRight: 48,
          }}
        >
          {name || launcherId}
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
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: theme.fonts.regular.fontFamily,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.tabNavigatorBackground,
          },
        }}
      >
        <Tab.Screen name="FarmerStats" options={{ title: t('stats') }}>
          {() => <FarmerStatsScreen data={data} loading={loading} error={error} />}
        </Tab.Screen>
        <Tab.Screen name="FarmerPartials" options={{ title: t('partials') }}>
          {() => <FarmerPartialScreen launcherIds={[launcherId]} />}
        </Tab.Screen>
        <Tab.Screen name="FarmerPayouts" options={{ title: t('payouts') }}>
          {() => <FarmerPayoutScreen launcherId={launcherId} />}
        </Tab.Screen>
        <Tab.Screen name="FarmerBlocks" options={{ title: t('blocks') }}>
          {() => <FarmerBlockScreen launcherId={launcherId} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default FarmerScreen;