/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { IconButton, Menu, Text, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  getBalanceFromAddresses,
  getFarmersFromLauncherIDAndStats,
  getPartialsFromIDs,
} from '../../Api';
import {
  currencyState,
  dashboardState,
  farmErrorState,
  farmLoadingState,
  launcherIDsState,
  settingsState,
} from '../../Atoms';
import CustomIconButton from '../../components/CustomIconButton';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import PressableCard from '../../components/PressableCard';
import { getCurrencyFromKey } from '../../screens/CurrencySelectionScreen';
import { formatBytes, formatPrice } from '../../utils/Formatting';
import FarmerBlockScreen from './farmer/Blocks';
import FarmerPartialScreen from './farmer/Partials';
import FarmerPayoutScreen from './farmer/Payouts';
import FarmerStatsScreen from './farmer/Stats';

const Tab = createMaterialTopTabNavigator();

const sumValue = (data, type) => data.map((item) => item[type]).reduce((a, b) => a + b);

const DashboardScreen = ({ navigation }) => {
  const [farms, setFarms] = useRecoilState(launcherIDsState);
  const [data, setData] = useRecoilState(dashboardState);
  const [loading, setLoading] = useRecoilState(farmLoadingState);
  const [error, setError] = useRecoilState(farmErrorState);
  const currency = useRecoilValue(currencyState);
  const { t } = useTranslation();
  const [visible, setVisible] = React.useState(false);
  const [measurements, setMeasurements] = useState();
  const [selected, setSelected] = useState(-1);
  const settings = useRecoilValue(settingsState);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '30%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const canEditFarmName = () => {
    if (farms.length === 1) {
      // console.log(!!farms[0].token);
      return !!farms[0].token;
    }
    if (farms.length > 0) {
      const farm = farms.find((item) => item.launcherId === selected);
      // console.log(!!farm.token);
      return !!farm.token;
    }
    return false;
  };

  // callbacks
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

  const renderBackground = useCallback(
    (props) => <View style={{ backgroundColor: 'red' }} {...props} />,
    []
  );

  // useEffect(() => {
  //   if (selected !== -1) {
  //     setDataToShow(data);
  //     // setFarms(farmsData.filter((item) => item.launcherId === selected));
  //   } else {
  //     setDataToShow({ farmers: data.farmers.filter((item) => item.launcher === selected) });
  //     // setFarms(farmsData);
  //   }
  //   // setLoading({ address: true, stats: true, partials: true, payouts: true });
  //   // console.log('called');
  // }, [farmsData, selected]);

  useEffect(() => {
    if (farms.length > 0) {
      // if (selected === -1) {
      setLoading((prev) => ({ ...prev, stats: true, partials: true, address: true }));
      let timestamp = new Date().getTime();
      timestamp = Math.floor(timestamp / 1000) - 60 * 60 * 24;
      const addressesToScan = new Set();
      const launcherIds = [];
      farms.forEach((item) => {
        if (item.token !== null) {
          addressesToScan.add(item.address);
          launcherIds.push(item.launcherId);
        }
      });
      if (launcherIds.length > 0) {
        // console.log(launcherIds.length);
        getBalanceFromAddresses(Array.from(addressesToScan), launcherIds)
          .then((response) => {
            setData((prev) => ({
              ...prev,
              balance: response,
            }));
          })
          .finally(() => {
            setLoading((prev) => ({ ...prev, address: false }));
          });
      } else {
        // console.log('Calle');
        setData((prev) => ({
          ...prev,
          balance: null,
        }));
      }

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
    }
  }, [farms]);

  const name = () => {
    if (farms.length === 1) {
      return farms[0].name;
    }
    if (selected !== -1) {
      const item = farms.find((item) => item.launcherId === selected);
      return item.name || item.launcherId;
    }
    if (farms.length === 0) {
      return 'None';
    }
    return 'Farms Grouped';
  };

  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1,  backgroundColor: theme.colors.statusBarColor}}>
      {/* <CustomStatusBar /> */}
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
            right: 0,
            top: 0,
          }}
        >
          {farms.length > 0 && (
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
              // size={24}
              onPress={handlePresentModalPress}
            />
          )}
        </View>
        {farms.length > 1 ? (
          <Pressable
            onLayout={({ nativeEvent }) => {
              setMeasurements(nativeEvent.layout);
            }}
            onPress={() => {
              if (farms.length > 1) {
                openMenu();
              }
            }}
            style={({ pressed }) => [
              {
                borderColor: visible ? theme.colors.primary : theme.colors.textGrey,
                borderRadius: 24,
                borderWidth: 0.6,
                padding: 4,
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            <Text
              style={{
                paddingTop: 2,
                fontSize: 13,
                paddingLeft: 16,
                // maxWidth: '70%',
                textAlign: 'center',
              }}
            >
              {name()}
            </Text>
            <IconButton style={{ marginRight: 10, margin: 0 }} icon="chevron-down" size={16} />
            {measurements && (
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={{ x: measurements.x, y: measurements.y + measurements.height }}
              >
                {selected !== -1 && (
                  <Menu.Item
                    onPress={() => {
                      setSelected(-1);
                      closeMenu();
                    }}
                    title="Farms Grouped"
                  />
                )}
                {farms
                  .filter((item) => item.launcherId !== selected)
                  .map((item) => (
                    <Menu.Item
                      key={item.launcherId}
                      onPress={() => {
                        setSelected(item.launcherId);
                        closeMenu();
                      }}
                      title={item.name || item.launcherId}
                    />
                  ))}
                {/* <Menu.Item onPress={() => {}} title="Item 1" />
                <Menu.Item onPress={() => {}} title="Item 2" />
                <Divider />
                <Menu.Item onPress={() => {}} title="Item 3" /> */}
              </Menu>
            )}
          </Pressable>
        ) : (
          <View>
            <Text
              style={{
                paddingTop: 16,
                fontSize: 15,
                // width: '70%',
                // paddingLeft: 16,
                // color: theme.colors.textGrey,
              }}
            >
              {name()}
            </Text>
          </View>
        )}
        {/* </Pressable> */}

        <Text style={{ paddingTop: 16, fontSize: 24 }}>
          {loading.address
            ? '0 XCH'
            : data.balance
            ? selected === -1
              ? `${data.balance
                  .map((item) => item.value)
                  .reduce((a, b) => a + b)
                  .toFixed(2)} XCH`
              : `${data.balance.find((item) => item.launcherId === selected).value.toFixed(2)} XCH`
            : null}
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
              {loading.stats
                ? '...'
                : selected === -1
                ? sumValue(data.farmers, 'difficulty')
                : sumValue(
                    data.farmers.filter((item) => item.launcher_id === selected),
                    'difficulty'
                  )}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>
              Daily Earnings
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {loading.stats
                ? '...'
                : selected === -1
                ? `${formatPrice(
                    (sumValue(data.farmers, 'estimated_size') / 1099511627776) *
                      data.stats.xch_tb_month *
                      data.stats.xch_current_price[currency],
                    currency
                  )}  ${getCurrencyFromKey(currency)}`
                : `${formatPrice(
                    (sumValue(
                      data.farmers.filter((item) => item.launcher_id === selected),
                      'estimated_size'
                    ) /
                      1099511627776) *
                      data.stats.xch_tb_month *
                      data.stats.xch_current_price[currency],
                    currency
                  )}  ${getCurrencyFromKey(currency)}`}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', color: theme.colors.textGrey }}>Size</Text>
            <Text style={{ textAlign: 'center' }}>
              {loading.stats
                ? '...'
                : selected === -1
                ? formatBytes(sumValue(data.farmers, 'estimated_size'))
                : formatBytes(
                    sumValue(
                      data.farmers.filter((item) => item.launcher_id === selected),
                      'estimated_size'
                    )
                  )}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: 1 }} />
      {farms.length > 0 ? (
        farms.length > 1 && selected === -1 ? (
          <Tab.Navigator
            screenOptions={{
              lazy: true,
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
                  data={data}
                  loading={loading}
                  error={error}
                  selected={selected}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="FarmerPartials" options={{ title: t('partials') }}>
              {() => <FarmerPartialScreen launcherIds={farms.map((item) => item.launcherId)} />}
            </Tab.Screen>
          </Tab.Navigator>
        ) : (
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
                  data={data}
                  loading={loading}
                  error={error}
                  selected={selected}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="FarmerPartials" options={{ title: t('partials') }}>
              {() => (
                <FarmerPartialScreen
                  selected={selected}
                  launcherIds={
                    selected !== -1
                      ? farms
                          .filter((item) => item.launcherId === selected)
                          .map((item) => item.launcherId)
                      : farms.map((item) => item.launcherId)
                  }
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="FarmerPayouts" options={{ title: t('payouts') }}>
              {() => (
                <FarmerPayoutScreen
                  selected={selected}
                  launcherId={
                    selected !== -1
                      ? farms.find((item) => item.launcherId === selected).launcherId
                      : farms.map((item) => item.launcherId)[0]
                  }
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="FarmerBlocks" options={{ title: t('blocks') }}>
              {() => (
                <FarmerBlockScreen
                  selected={selected}
                  launcherId={
                    selected !== -1
                      ? farms.find((item) => item.launcherId === selected).launcherId
                      : farms.map((item) => item.launcherId)[0]
                  }
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        )
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.background ,
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        // style={{ backgroundColor: theme.colors.background }}
        // onChange={handleSheetChanges}
        // handleStyle={{ backgroundColor: 'red' }}

        backgroundStyle={{
          backgroundColor: theme.colors.tabNavigatorBackground,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textGrey }}
        // backgroundComponent={() => (
        //   <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]} />
        // )}
        backdropComponent={renderBackdrop}
      >
        <View style={{ flex: 1 }}>
          {selected === -1 && farms.length > 1 ? (
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
                <Text style={{ fontSize: 16 }}>Add Or Verfiy Farm</Text>
              </View>
            </PressableCard>
          ) : (
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
                  // navigation.navigate('Verify Farm');
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CustomIconButton
                    icon={<Ionicons name="scan" size={24} color={theme.colors.textGrey} />}
                    title="Info"
                    color="#fff"
                  />
                  <Text style={{ fontSize: 16 }}>Add Or Verfiy Farm</Text>
                </View>
              </PressableCard>
              {/* {canEditFarmName() && ( */}
              <PressableCard
                style={{
                  justifyContent: 'center',
                  padding: 4,
                  backgroundColor: theme.colors.tabNavigatorBackground,
                }}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                  if (farms.length === 1) {
                    setTimeout(
                      () =>
                        navigation.navigate({
                          name: 'Farmer Name',
                          params: {
                            launcherId: farms[0].launcherId,
                            token: farms[0].token,
                            name: farms[0].name,
                          },
                        }),
                      200
                    );
                  } else {
                    const farm = farms.find((item) => item.launcherId === selected);
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
                  }
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
              {/* )} */}
              <PressableCard
                style={{
                  justifyContent: 'center',
                  padding: 4,
                  backgroundColor: theme.colors.tabNavigatorBackground,
                }}
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                  setSelected(-1);
                  if (farms.length === 1) {
                    setLoading({ stats: true, partials: true, address: true });
                    setFarms([]);
                    setData({});
                  } else {
                    setLoading({ stats: true, partials: true, address: true });
                    setData({});
                    const newData = farms.filter((item) => item.launcherId !== selected);
                    setFarms(newData);
                  }
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
            </View>
          )}
          {/* <CustomIconButton
              icon={<Ionicons name="scan" size={24} color={theme.colors.textGrey} />}
              onPress={() => {
                navigation.navigate('Verify Farm');
              }}
              title="Info"
              color="#fff"
            /> */}
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // backgroundColor: 'red',
  },
  closeLineContainer: {
    alignSelf: 'center',
  },
  closeLine: {
    width: 40,
    height: 6,
    borderRadius: 3,
    // backgroundColor: Colors.lightGray,
    marginTop: 9,
  },
});

export default DashboardScreen;
