/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, View } from 'react-native';
import { Button, Dialog, IconButton, Portal, Switch, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useRecoilRefresher_UNSTABLE as useRecoilRefresher,
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValue,
} from 'recoil';
import CustomIconButton from '../components/CustomIconButton';
import DropdownSelector from '../components/DropdownSelector';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import PressableCard from '../components/PressableCard';
import {
  currencyState,
  dashboardSelectedState,
  dashboardState,
  launcherIDsState,
  settingsState,
} from '../recoil/Atoms';
import { convertMojoToChia, formatBytes, formatPrice } from '../utils/Formatting';
import FarmerBlockScreen from './dashboard/Blocks';
import FarmerPartialScreen from './dashboard/Partials';
import FarmerPayoutScreen from './dashboard/Payouts';
import FarmerStatsScreen from './dashboard/Stats';
import { getCurrencyFromKey } from './more/Currency';

const Tab = createMaterialTopTabNavigator();

const farm = (farms) => farms[0];
const sumValue = (data, type) => {
  if (data.length === 1) {
    return data[0][type];
  }
  return data.map((item) => item[type]).reduce((a, b) => a + b);
};

const LoadingText = ({ loading, error, value, style, formatValue }) => {
  if (loading || !value) return <Text style={style}>...</Text>;
  if (error) return null;
  return <Text style={style}>{formatValue(value)}</Text>;
};

const Content = ({ navigation }) => {
  const [farms, setFarms] = useRecoilState(launcherIDsState);
  const [dashboard, setDashboard] = useRecoilStateLoadable(dashboardState);
  const refreshDashboard = useRecoilRefresher(dashboardState);
  const [selected, setSelected] = useRecoilState(dashboardSelectedState);
  const currency = useRecoilValue(currencyState);
  const theme = useTheme();
  const [settings, setSettings] = useRecoilState(settingsState);
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);

  // variables
  const snapPoints = useMemo(() => ['25%', '40%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        style={{ position: 'absolute', top: -40, left: 0, right: 0, bottom: 49 }}
        {...props}
      />
    ),
    []
  );

  if (farms.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
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
    );
  }

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
          {farms.length > 0 && (
            <CustomIconButton
              style={{ marginTop: 10, marginRight: 10 }}
              icon={<Ionicons name="refresh" size={24} color={theme.colors.text} />}
              color="#fff"
              // size={24}
              onPress={() => {
                refreshDashboard();
              }}
            />
          )}
        </View>
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
            style={{ marginTop: 10, marginRight: 10 }}
            icon={
              <Ionicons
                name={Platform.OS === 'ios' ? 'ellipsis-horizontal' : 'ellipsis-vertical'}
                size={24}
                color={theme.colors.text}
              />
            }
            color="#fff"
            onPress={handlePresentModalPress}
          />
        </View>
        {farms.length === 1 ? (
          <Text
            numberOfLines={1}
            style={{
              paddingTop: 24,
              fontSize: 20,
              marginLeft: 48,
              marginRight: 48,
            }}
          >
            {farm(farms).name || farm(farms).launcherId}
          </Text>
        ) : (
          <DropdownSelector
            defaultTitle="All"
            style={{ marginTop: 16, padding: 2, width: 200 }}
            data={farms}
            onPressed={(item) => {
              setSelected(item);
            }}
            setSelected={setSelected}
            selected={selected}
            keyExtractor={(item) => item.launcherId}
            valueExtractor={(item) => item.name || item.launcherId}
          />
        )}
        <View style={{ alignItems: 'center' }}>
          {settings.showBalance && (
            <LoadingText
              loading={dashboard.state === 'loading'}
              error={dashboard.state === 'hasError'}
              style={{ paddingTop: 16, fontSize: 24 }}
              value={dashboard.contents.balances}
              formatValue={(val) =>
                // `${val}`
                `${val
                  .map((item) => item.balance)
                  .map((item) => item.data.unspentBalance)
                  .reduce((a, b) => a + b)
                  .toFixed(3)} XCH`
              }
            />
          )}
          <View
            style={{
              flexDirection: 'row',
              margin: 'auto',
              marginTop: 16,
            }}
          >
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey, paddingEnd: 12 }}>
              Paid
            </Text>

            <LoadingText
              loading={dashboard.state === 'loading'}
              error={dashboard.state === 'hasError'}
              style={{ textAlign: 'center', paddingEnd: 36 }}
              value={dashboard.contents.farms}
              formatValue={(val) =>
                `${convertMojoToChia(
                  sumValue(
                    val.map((item) => item.payout),
                    'total_paid'
                  )
                ).toFixed(3)} XCH`
              }
            />

            <Text style={{ textAlign: 'center', color: theme.colors.textGrey, paddingEnd: 12 }}>
              Unpaid
            </Text>

            <LoadingText
              loading={dashboard.state === 'loading'}
              error={dashboard.state === 'hasError'}
              style={{ textAlign: 'center' }}
              value={dashboard.contents.farms}
              formatValue={(val) =>
                `${convertMojoToChia(
                  sumValue(
                    val.map((item) => item.payout),
                    'total_unpaid'
                  )
                ).toFixed(3)} XCH`
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              margin: 'auto',
              marginTop: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>Difficulty</Text>
              <LoadingText
                loading={dashboard.state === 'loading'}
                error={dashboard.state === 'hasError'}
                style={{ textAlign: 'center' }}
                value={dashboard.contents.farms}
                formatValue={(val) => sumValue(val, 'difficulty')}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>
                Daily Earnings
              </Text>
              <LoadingText
                loading={dashboard.state === 'loading'}
                error={dashboard.state === 'hasError'}
                style={{ textAlign: 'center' }}
                value={dashboard.contents}
                formatValue={(val) =>
                  `${formatPrice(
                    (sumValue(val.farms, 'estimated_size') / 1099511627776) *
                      val.stats.xch_tb_month *
                      val.stats.xch_current_price[currency],
                    currency
                  )}  ${getCurrencyFromKey(currency)}`
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>Size</Text>

              <LoadingText
                loading={dashboard.state === 'loading'}
                error={dashboard.state === 'hasError'}
                style={{ textAlign: 'center' }}
                value={dashboard.contents.farms}
                formatValue={(val) => `${formatBytes(sumValue(val, 'estimated_size'))}`}
              />
            </View>
          </View>
        </View>
      </View>
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
              selected={selected}
              launcherIds={
                selected
                  ? farms
                      .filter((item) => item.launcherId === selected.launcherId)
                      .map((item) => item.launcherId)
                  : farms.map((item) => item.launcherId)
              }
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="FarmerPartials" options={{ title: t('partials') }}>
          {() => (
            <FarmerPartialScreen
              selected={selected}
              launcherIds={
                selected
                  ? farms
                      .filter((item) => item.launcherId === selected.launcherId)
                      .map((item) => item.launcherId)
                  : farms.map((item) => item.launcherId)
              }
            />
          )}
        </Tab.Screen>
        {(selected || farms.length === 1) && (
          <Tab.Screen name="FarmerPayouts" options={{ title: t('payouts') }}>
            {() => (
              <FarmerPayoutScreen
                selected={selected}
                launcherId={
                  selected
                    ? farms.find((item) => item.launcherId === selected.launcherId).launcherId
                    : farms.map((item) => item.launcherId)[0]
                }
              />
            )}
          </Tab.Screen>
        )}
        {(selected || farms.length === 1) && (
          <Tab.Screen name="FarmerBlocks" options={{ title: t('blocks') }}>
            {() => (
              <FarmerBlockScreen
                selected={selected}
                launcherId={
                  selected
                    ? farms.find((item) => item.launcherId === selected.launcherId).launcherId
                    : farms.map((item) => item.launcherId)[0]
                }
              />
            )}
          </Tab.Screen>
        )}
      </Tab.Navigator>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.colors.tabNavigatorBackground,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textGrey }}
        backdropComponent={renderBackdrop}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'column' }}>
            <PressableCard
              style={{
                justifyContent: 'center',
                padding: 4,
                backgroundColor: theme.colors.tabNavigatorBackground,
              }}
              onPress={() => {
                bottomSheetModalRef.current?.dismiss();
                setTimeout(() => navigation.navigate('Verify Farm'), 200);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomIconButton
                  icon={<Ionicons name="scan" size={24} color={theme.colors.textGrey} />}
                  title="Info"
                  color="#fff"
                />
                <Text style={{ fontSize: 16 }}>Add Farm</Text>
              </View>
            </PressableCard>
            {(selected || farms.length === 1) && (
              <PressableCard
                style={{
                  justifyContent: 'center',
                  padding: 4,
                  backgroundColor: theme.colors.tabNavigatorBackground,
                }}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                  const farm = farms.find((item) =>
                    item.launcherId === selected ? selected.launcherId : item.launcherId
                  );
                  setTimeout(
                    () =>
                      navigation.navigate({
                        name: 'Farmer Name',
                        params: {
                          launcherId: farm.launcherId,
                          token: farm.token,
                          name: farm.name,
                        },
                      }),
                    200
                  );
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CustomIconButton
                    icon={<Ionicons name="pencil-sharp" size={24} color={theme.colors.textGrey} />}
                    title="Info"
                    color="#fff"
                  />

                  <Text style={{ fontSize: 16 }}>Farm Name</Text>
                </View>
              </PressableCard>
            )}
            <PressableCard
              style={{
                justifyContent: 'center',
                padding: 4,
                backgroundColor: theme.colors.tabNavigatorBackground,
                // backgroundColor: 'blue',
              }}
              onPress={() => {
                // bottomSheetModalRef.current?.dismiss();
                setSettings((prev) => ({ ...prev, showBalance: !prev.showBalance }));
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                <Text style={{ fontSize: 16, paddingLeft: 12, flex: 1 }}>
                  Show Payout Address Balance
                </Text>
                <View pointerEvents="none" style={{ paddingRight: 16 }}>
                  <Switch
                    value={settings.showBalance}
                    trackColor={{ true: theme.colors.accentLight, false: 'rgba(0, 0, 0, 0.4)' }}
                  />
                </View>
              </View>
            </PressableCard>
            {(selected || farms.length === 1) && (
              <PressableCard
                style={{
                  justifyContent: 'center',
                  padding: 4,
                  backgroundColor: theme.colors.tabNavigatorBackground,
                }}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                  setShowDialog(true);

                  setSelected(null);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CustomIconButton
                    icon={
                      <Ionicons name="trash-bin-outline" size={24} color={theme.colors.textGrey} />
                    }
                    title="Info"
                    color="#fff"
                  />

                  <Text style={{ fontSize: 16 }}>Remove Farm</Text>
                </View>
              </PressableCard>
            )}
          </View>
        </View>
      </BottomSheetModal>
      <Portal>
        <Dialog
          style={{
            borderRadius: settings.sharpEdges ? theme.tileModeRadius : theme.roundModeRadius,
          }}
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
        >
          <Dialog.Title>Remove Farm</Dialog.Title>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setShowDialog(false);
              }}
            >
              No
            </Button>
            <Button
              onPress={() => {
                if (farms.length === 1) {
                  setFarms([]);
                } else {
                  const newData = farms.filter((item) => item.launcherId !== selected.launcherId);
                  setFarms(newData);
                }
                setShowDialog(false);
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const theme = useTheme();
  const refreshDashboard = useRecoilRefresher(dashboardState);

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: theme.colors.onSurfaceLight,
      }}
    >
      <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 16 }}>{error.message}</Text>
      <Button
        mode="contained"
        onPress={() => {
          refreshDashboard();
          resetErrorBoundary();
        }}
      >
        Retry
      </Button>
    </SafeAreaView>
  );
};

const DashboardScreen = (props) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Content {...props} />
    </ErrorBoundary>
  );
};

export default DashboardScreen;
