/* eslint-disable no-nested-ternary */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, SafeAreaView, TouchableHighlight, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { api } from '../../services/Api';
import { currencyState, settingsState } from '../../recoil/Atoms';
import CustomIconButton from '../../components/CustomIconButton';
import { getCurrencyFromKey } from '../more/Currency';
import { convertMojoToChia, formatBytes, formatPrice } from '../../utils/Formatting';
import FarmerBlockScreen from './Blocks';
import FarmerPartialScreen from './Partials';
import FarmerPayoutScreen from './Payouts';
import FarmerStatsScreen from './Stats';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

const earningTypes = [
  { title: 'Daily Rewards', days: 1 },
  { title: 'Weekly Rewards', days: 7 },
  { title: 'Montly Rewards', days: 30 },
  { title: 'Yearly Rewards', days: 365 },
];

const Tab = createMaterialTopTabNavigator();

const Content = ({ route, navigation }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFiat, setShowFiat] = useState(false);
  const [settings, setSettings] = useRecoilState(settingsState);
  const currency = useRecoilValue(currencyState);
  const { launcherId, name } = route.params;
  const [earningState, setEarningState] = useState(0);
  const { t } = useTranslation();
  const theme = useTheme();
  const handleError = useErrorHandler();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const stats = await api({ url: 'stats' }, controller.signal).catch((err) => {
        handleError(err);
      });
      const farmer = await api({ url: `launcher/${launcherId}/` }, controller.signal).catch(
        (err) => {
          handleError(err);
        }
      );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.statusBarColor }}>
      <FocusAwareStatusBar
        backgroundColor={theme.colors.statusBarColor}
        barStyle={settings.isThemeDark ? 'light-content' : 'dark-content'}
      />
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
        <View
          style={{
            backgroundColor: theme.colors.onSurfaceLight,
            alignItems: 'center',
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
            top: 0,
            // marginTop: 12,
            marginRight: 6,
          }}
        >
          <TouchableHighlight
            style={{
              width: 36,
              height: 36,
              borderRadius: 36,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.6}
            underlayColor={settings.isThemeDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
            onPress={() => {
              setShowFiat((prev) => !prev);
            }}
          >
            <Text style={{ fontSize: 14, textAlign: 'center', textAlignVertical: 'center' }}>
              {showFiat ? 'XCH' : currency.toUpperCase()}
            </Text>
          </TouchableHighlight>
        </View>
        <Text
          numberOfLines={1}
          style={{
            paddingTop: 24,
            fontSize: 17,
            marginLeft: 40,
            marginRight: 40,
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
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>Paid</Text>
            <Text style={{ textAlign: 'center' }}>
              {loading
                ? '...'
                : showFiat
                ? `${(
                    convertMojoToChia(data.farmer.payout.total_paid) *
                    data.stats.xch_current_price[currency]
                  ).toFixed(2)} ${getCurrencyFromKey(currency)}`
                : `${convertMojoToChia(data.farmer.payout.total_paid).toFixed(3)} XCH`}
            </Text>
          </View>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              if (earningState === earningTypes.length - 1) {
                setEarningState(0);
              } else setEarningState((prev) => prev + 1);
            }}
          >
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>
              {earningTypes[earningState].title}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {loading
                ? '...'
                : showFiat
                ? `${formatPrice(
                    (data.farmer.estimated_size / 1099511627776) *
                      data.stats.xch_tb_month *
                      earningTypes[earningState].days *
                      data.stats.xch_current_price[currency],
                    currency
                  )}  ${getCurrencyFromKey(currency)}`
                : `${(
                    (data.farmer.estimated_size / 1099511627776) *
                    data.stats.xch_tb_month *
                    earningTypes[earningState].days
                  ).toFixed(4)}  XCH`}
            </Text>
          </Pressable>
          {/* <View style={{ flex: 1 }}>
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
          </View> */}
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
          {() => (
            <FarmerStatsScreen
              launcherIds={[launcherId]}
              farmData={[data.farmer]}
              loading={loading}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="FarmerPartials" options={{ title: t('partials') }}>
          {() => (
            <FarmerPartialScreen
              launcherIds={[launcherId]}
              farmData={[data.farmer]}
              loading={loading}
            />
          )}
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
