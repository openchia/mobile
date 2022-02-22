/* eslint-disable no-nested-ternary */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilValue } from 'recoil';
import { apiGet, apiMultiGet } from '../../services/Api';
import { currencyState } from '../../recoil/Atoms';
import CustomIconButton from '../../components/CustomIconButton';
import { getCurrencyFromKey } from '../more/Currency';
import { formatBytes, formatPrice } from '../../utils/Formatting';
import FarmerBlockScreen from './Blocks';
import FarmerPartialScreen from './Partials';
import FarmerPayoutScreen from './Payouts';
import FarmerStatsScreen from './Stats';

const Tab = createMaterialTopTabNavigator();

const Content = ({ route, navigation }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const currency = useRecoilValue(currencyState);
  const { launcherId, name } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  const handleError = useErrorHandler();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const stats = await apiGet('stats', {
        signal: controller.signal,
      }).catch((err) => {
        handleError(err);
      });
      const farmer = await apiGet(`launcher/${launcherId}/`, {
        signal: controller.signal,
      }).catch((err) => {
        handleError(err);
      });
      if (stats && farmer) {
        setData({ stats, farmer });
      }
      setLoading(false);
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

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
            <Text style={{ textAlign: 'center' }}>{loading ? '...' : data.farmer.difficulty}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>
              Daily Earnings
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {loading
                ? '...'
                : `${formatPrice(
                    (data.farmer.estimated_size / 1099511627776) *
                      data.stats.xch_tb_month *
                      data.stats.xch_current_price[currency],
                    currency
                  )}  ${getCurrencyFromKey(currency)}`}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>Size</Text>
            <Text style={{ textAlign: 'center' }}>
              {loading ? '...' : formatBytes(data.farmer.estimated_size)}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: 1 }} />
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarLabelStyle: {
            fontFamily: theme.fonts.regular.fontFamily,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.tabNavigatorBackground,
          },
        }}
      >
        <Tab.Screen name="FarmerStats" options={{ title: t('stats') }}>
          {() => <FarmerStatsScreen launcherIds={[launcherId]} />}
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

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: theme.colors.onSurfaceLight,
      }}
    >
      <View
        style={{
          // backgroundColor: theme.colors.onSurfaceLight,
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
          size={24}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16 }}>{error.message}</Text>
      <Button mode="contained" onPress={resetErrorBoundary}>
        Retry
      </Button>
    </SafeAreaView>
  );
};

const FarmerScreen = ({ route, navigation }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Content route={route} navigation={navigation} />
  </ErrorBoundary>
);

export default FarmerScreen;
