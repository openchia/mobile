/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  SafeAreaView,
  TouchableHighlight,
  useWindowDimensions,
  View,
} from 'react-native';
import { Button, IconButton, Portal, Switch, Text, useTheme } from 'react-native-paper';
import Dialog from 'react-native-dialog';
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
import FarmerPayoutScreen from './dashboard/Payouts';
import FarmerStatsScreen from './dashboard/Stats';
import { getCurrencyFromKey } from './more/Currency';
import PartialsScreen from './dashboard/Partials';
import FeeScreen from './dashboard/Fee';

const earningTypes = [
  { title: 'dailyRewards', days: 1 },
  { title: 'weeklyRewards', days: 7 },
  { title: 'monthlyRewards', days: 30 },
  { title: 'yearlyRewards', days: 365 },
];

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
  const [selected, setSelected] = useRecoilState(dashboardSelectedState);
  const currency = useRecoilValue(currencyState);
  const theme = useTheme();
  const [settings, setSettings] = useRecoilState(settingsState);
  // const { t } = useTranslation();
  const { t } = useTranslation();

  const bottomSheetModalRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [earningState, setEarningState] = useState(0);
  const [showFiat, setShowFiat] = useState(false);
  const handleError = useErrorHandler();
  const { width } = useWindowDimensions();

  const showPaid = (showFiat, val, togglePaid) => {
    if (togglePaid) {
      return showFiat
        ? `${(
            convertMojoToChia(
              sumValue(
                val.farms.map((item) => item.payout),
                'total_unpaid'
              )
            ) * val.stats.xch_current_price[currency]
          ).toFixed(2)} ${getCurrencyFromKey(currency)}`
        : `${convertMojoToChia(
            sumValue(
              val.farms.map((item) => item.payout),
              'total_unpaid'
            )
          ).toFixed(3)} XCH`;
    }
    return showFiat
      ? `${(
          convertMojoToChia(
            sumValue(
              val.farms.map((item) => item.payout),
              'total_paid'
            )
          ) * val.stats.xch_current_price[currency]
        ).toFixed(2)} ${getCurrencyFromKey(currency)}`
      : `${convertMojoToChia(
          sumValue(
            val.farms.map((item) => item.payout),
            'total_paid'
          )
        ).toFixed(3)} XCH`;
  };

  // variables
  const snapPoints = useMemo(() => ['15%', '60%'], []);

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

  if (dashboard.state === 'hasError') {
    handleError(dashboard.contents.balance);
  }

  // console.log(dashboard.contents.balances[0].balance.data);

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
        <Text style={{ fontSize: 18 }}>{t('addFarmTitle')}</Text>
        <Text style={{ fontSize: 14, color: theme.colors.textGrey, paddingBottom: 16 }}>
          {t('addFarmDesc')}
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
          paddingBottom: 8,
        }}
      >
        {farms.length === 1 ? (
          <Text
            numberOfLines={1}
            style={{
              paddingTop: 16,
              fontSize: 17,
              marginLeft: 16,
              marginRight: 16,
              textAlign: 'center',
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
        <View
          style={{
            backgroundColor: theme.colors.onSurfaceLight,
            alignItems: 'center',
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
            top: 0,
            marginTop: 12,
            marginRight: 0,
          }}
        >
          <CustomIconButton
            style={{ margin: 0, padding: 0 }}
            icon={<Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />}
            color="#fff"
            onPress={handlePresentModalPress}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
          {settings.showBalance && (
            <LoadingText
              loading={dashboard.state === 'loading'}
              error={dashboard.state === 'hasError'}
              style={{ paddingTop: 16, fontSize: 20 }}
              value={dashboard.contents}
              formatValue={(val) =>
                // balances[0].balance.data
                showFiat
                  ? `${(
                      val.balances
                        .map((item) => item.balance)
                        .map((item) => item.data.balance)
                        .reduce((a, b) => a + b) * val.stats.xch_current_price[currency]
                    ).toFixed(2)} ${getCurrencyFromKey(currency)}`
                  : `${val.balances
                      .map((item) => item.balance)
                      .map((item) => item.data.balance)
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
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                setSettings((prev) => ({ ...prev, togglePaid: !prev.togglePaid }));
              }}
            >
              <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>
                {settings.togglePaid ? t('unpaid') : t('paid')}
              </Text>
              <LoadingText
                loading={dashboard.state === 'loading'}
                error={dashboard.state === 'hasError'}
                style={{ textAlign: 'center' }}
                value={dashboard.contents}
                formatValue={
                  (val) => showPaid(showFiat, val, settings.togglePaid)
                  // showFiat
                  //   ? `${(
                  //       convertMojoToChia(
                  //         sumValue(
                  //           val.farms.map((item) => item.payout),
                  //           'total_paid'
                  //         )
                  //       ) * val.stats.xch_current_price[currency]
                  //     ).toFixed(2)} ${getCurrencyFromKey(currency)}`
                  //   : `${convertMojoToChia(
                  //       sumValue(
                  //         val.farms.map((item) => item.payout),
                  //         'total_paid'
                  //       )
                  //     ).toFixed(3)} XCH`
                }
              />
            </Pressable>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                if (earningState === earningTypes.length - 1) {
                  setEarningState(0);
                } else setEarningState((prev) => prev + 1);
              }}
            >
              <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>
                {t(earningTypes[earningState].title)}
              </Text>
              <LoadingText
                loading={dashboard.state === 'loading'}
                error={dashboard.state === 'hasError'}
                style={{ textAlign: 'center' }}
                value={dashboard.contents}
                formatValue={(val) =>
                  showFiat
                    ? `${formatPrice(
                        (sumValue(val.farms, 'estimated_size') / 1099511627776) *
                          val.stats.xch_tb_month *
                          earningTypes[earningState].days *
                          val.stats.xch_current_price[currency],
                        currency
                      )}  ${getCurrencyFromKey(currency)}`
                    : `${(
                        (sumValue(val.farms, 'estimated_size') / 1099511627776) *
                        val.stats.xch_tb_month *
                        earningTypes[earningState].days
                      ).toFixed(4)}  XCH`
                }
              />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>{t('size')}</Text>

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
            fontSize: 11,
            textTransform: 'none',
          },
          tabBarItemStyle: { padding: 0 },
          tabBarStyle: {
            padding: 0,
            backgroundColor: theme.colors.tabNavigatorBackground,
          },
        }}
      >
        <Tab.Screen name="FarmerStats" options={{ title: t('stats') }}>
          {() => (
            <FarmerStatsScreen
              selected={selected}
              farmData={dashboard.contents.farms}
              loading={dashboard.state === 'loading'}
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
        <Tab.Screen name="PartialStats" options={{ title: t('partials') }}>
          {() => (
            <PartialsScreen
              selected={selected}
              farmData={dashboard.contents.farms}
              loading={dashboard.state === 'loading'}
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
        <View>
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
                <Text style={{ fontSize: 16 }}>{t('bottomSheet.addFarm')}</Text>
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
                  navigation.navigate({
                    name: 'Farmer Settings',
                    params: {
                      farm: selected || farms[0],
                    },
                  });
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CustomIconButton
                    icon={<Ionicons name="settings" size={24} color={theme.colors.textGrey} />}
                    title="Info"
                    color="#fff"
                  />

                  <Text style={{ fontSize: 16 }}>{t('bottomSheet.farmSettings')}</Text>
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
                setShowFiat((prev) => !prev);
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
                <Text numberOfLines={1} style={{ fontSize: 16, paddingLeft: 12, flex: 1 }}>
                  {t('bottomSheet.showIn')} {showFiat ? 'XCH' : currency.toUpperCase()}
                </Text>
                {/* <View pointerEvents="none" style={{ paddingRight: 16 }}>
                  <Text> {showFiat ? 'XCH' : currency.toUpperCase()}</Text>
                </View> */}
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
                  <Text numberOfLines={1} style={{ fontSize: 16, paddingLeft: 12, flex: 1 }}>
                    {t('bottomSheet.showPayoutAddrBalance')}
                  </Text>
                  <View pointerEvents="none" style={{ paddingRight: 16 }}>
                    <Switch
                      value={settings.showBalance}
                      trackColor={{ true: theme.colors.accentLight, false: 'rgba(0, 0, 0, 0.4)' }}
                    />
                  </View>
                </View>
              </PressableCard>
            )}
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
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CustomIconButton
                    icon={<Ionicons name="trash-bin" size={24} color={theme.colors.textGrey} />}
                    title="Info"
                    color="#fff"
                  />

                  <Text style={{ fontSize: 16 }}>{t('bottomSheet.removeFarm')}</Text>
                </View>
              </PressableCard>
            )}
          </View>
        </View>
      </BottomSheetModal>
      {Platform.OS === 'android' ? (
        <Dialog.Container
          contentStyle={{ backgroundColor: theme.colors.onSurfaceLight }}
          visible={showDialog}
          onBackdropPress={() => {
            setShowDialog(false);
          }}
        >
          <Dialog.Title style={{ color: theme.colors.text }}>Remove Farm</Dialog.Title>
          <Dialog.Description>Do you want to remove the farm ?</Dialog.Description>
          <Dialog.Button
            bold
            label="No"
            color={theme.colors.primaryLight}
            onPress={() => {
              setShowDialog(false);
            }}
          />
          <Dialog.Button
            bold
            label="Yes"
            color={theme.colors.primaryLight}
            onPress={() => {
              if (farms.length === 1) {
                setFarms([]);
              } else {
                const newData = farms.filter((item) => item.launcherId !== selected.launcherId);
                setFarms(newData);
                setSelected(null);
              }
              setShowDialog(false);
            }}
          />
        </Dialog.Container>
      ) : (
        <Dialog.Container
          visible={showDialog}
          onBackdropPress={() => {
            setShowDialog(false);
          }}
        >
          <Dialog.Title>Remove Farm</Dialog.Title>
          <Dialog.Description>Do you want to remove the farm ?</Dialog.Description>
          <Dialog.Button
            bold
            label="No"
            onPress={() => {
              setShowDialog(false);
            }}
          />
          <Dialog.Button
            bold
            label="Yes"
            onPress={() => {
              if (farms.length === 1) {
                setFarms([]);
              } else {
                const newData = farms.filter((item) => item.launcherId !== selected.launcherId);
                setFarms(newData);
                setSelected(null);
              }
              setShowDialog(false);
            }}
          />
        </Dialog.Container>
      )}
      {/* <Portal>
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
                  setSelected(null);
                }
                setShowDialog(false);
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal> */}
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
