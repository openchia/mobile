/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LogBox, StatusBar, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRecoilValueLoadable } from 'recoil';
import { currencyState, launcherIDsState, settingsState } from './recoil/Atoms';
import NetspaceScreen from './screens/charts/Netspace';
import ChiaPriceScreen from './screens/charts/ChiaPrice';
import PoolspaceScreen from './screens/charts/Poolspace';
import CurrencySelectionScreen from './screens/more/Currency';
import FarmerNameScreen from './screens/dashboard/FarmerName';
import LanguageSelectorScreen from './screens/more/Language';
import NewsPostScreen from './screens/news/Post';
import NewsScreen from './screens/News';
import ScanScreen from './screens/more/Scan';
import { DarkTheme, LightTheme } from './Theme';
import DashboardScreen from './screens/Dashboard';
import FarmerScreen from './screens/pool/Farmer';
import LaunchOptionScreen from './screens/more/Launch';
import MoreScreen from './screens/More';
import PoolScreen from './screens/Pool';
import FarmerSettingsScreen from './screens/dashboard/Settings';
import SettingComponentScreen from './screens/dashboard/settings/SettingComponent';
import DifficultyScreen from './screens/dashboard/settings/Difficulty';
import MinPayoutScreen from './screens/dashboard/settings/MinPayout';
import SizeDropPercentScreen from './screens/dashboard/settings/SizeDropPercent';
import SizeDropIntervalScreen from './screens/dashboard/settings/SizeDropInterval';
import FarmerPartialScreen from './screens/charts/Partials';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(['timer']);
LogBox.ignoreLogs(['keyboardDidShow: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['keyboardDidHide: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['cycle']);

const Root = ({ settings }) => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName={settings.intialRoute}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.tabNavigatorBackground },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabNavigatorBackground,
          borderTopColor: theme.colors.tabNavigatorTopBorderColor,
        },
        tabBarInactiveTintColor: theme.colors.textGreyLight,
        tabBarLabelStyle: {
          // fontFamily: theme.fonts.regular.fontFamily,
          //    fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={PoolScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'ios-newspaper' : 'ios-newspaper-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          headerShown: false,

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const BaseScreen = () => {
  const settingsLoadable = useRecoilValueLoadable(settingsState);
  const farmsLoadable = useRecoilValueLoadable(launcherIDsState);
  const currencyLoadable = useRecoilValueLoadable(currencyState);
  const { t } = useTranslation();

  useEffect(() => {
    if (
      settingsLoadable.state === 'hasValue' &&
      farmsLoadable.state === 'hasValue' &&
      currencyLoadable.state === 'hasValue'
    ) {
      SplashScreen.hide();
    }
  }, [settingsLoadable, farmsLoadable, currencyLoadable]);

  if (
    settingsLoadable.state === 'loading' ||
    farmsLoadable.state === 'loading' ||
    currencyLoadable.state === 'loading'
  ) {
    return null;
  }

  const theme = settingsLoadable.contents.isThemeDark ? DarkTheme : LightTheme;

  return (
    <ToastProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <BottomSheetModalProvider>
                <StatusBar
                  backgroundColor={theme.colors.statusBarColor}
                  barStyle={
                    settingsLoadable.contents.isThemeDark ? 'light-content' : 'dark-content'
                  }
                />
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.tabNavigatorBackground },
                    headerBackTitleVisible: false,
                    gestureEnabled: true, // If you want to swipe back like iOS on Android
                    animation: 'slide_from_right',
                    tabBarItemStyle: { padding: 0 },
                  }}
                >
                  <Stack.Screen name="Root" options={{ headerShown: false }}>
                    {() => <Root theme={theme} settings={settingsLoadable.contents} />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="FarmerScreen"
                    component={FarmerScreen}
                    options={({ route }) => ({
                      headerShown: false,
                    })}
                  />
                  <Stack.Screen
                    name="Post"
                    component={NewsPostScreen}
                    options={() => ({
                      title: t('screenNames.post'),
                    })}
                  />
                  <Stack.Screen
                    name="Language"
                    component={LanguageSelectorScreen}
                    options={() => ({
                      title: t('screenNames.language'),
                    })}
                  />
                  <Stack.Screen
                    name="Currency"
                    component={CurrencySelectionScreen}
                    options={() => ({
                      title: t('screenNames.currency'),
                    })}
                  />
                  <Stack.Screen
                    name="Poolspace"
                    component={PoolspaceScreen}
                    options={() => ({
                      title: t('screenNames.poolNetspaceChart'),
                    })}
                  />
                  <Stack.Screen
                    name="Netspace"
                    component={NetspaceScreen}
                    options={() => ({
                      title: t('screenNames.netspaceChart'),
                    })}
                  />
                  <Stack.Screen
                    name="Chia Price Chart"
                    component={ChiaPriceScreen}
                    options={() => ({
                      title: t('screenNames.priceChart'),
                    })}
                  />
                  <Stack.Screen
                    name="Farmer Name"
                    component={FarmerNameScreen}
                    options={() => ({
                      title: t('screenNames.farmName'),
                    })}
                  />
                  <Stack.Screen
                    name="Verify Farm"
                    component={ScanScreen}
                    options={() => ({
                      title: t('screenNames.verifyFarm'),
                    })}
                  />
                  <Stack.Screen
                    name="LaunchOptionScreen"
                    component={LaunchOptionScreen}
                    options={() => ({
                      title: t('screenNames.launchScreen'),
                    })}
                  />
                  <Stack.Screen
                    name="Farmer Settings"
                    component={FarmerSettingsScreen}
                    options={() => ({
                      title: t('screenNames.farmSettings'),
                    })}
                  />
                  <Stack.Screen
                    name="Settings Component"
                    component={SettingComponentScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Difficulty Setting"
                    component={DifficultyScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Min Payout Setting"
                    component={MinPayoutScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Size Drop Setting"
                    component={SizeDropPercentScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  <Stack.Screen
                    name="Size Drop Interval"
                    component={SizeDropIntervalScreen}
                    options={({ route }) => ({
                      title: route.params.title,
                    })}
                  />
                  {/* <Stack.Screen
                    name="Farmer Partials Chart"
                    component={FarmerPartialScreen}
                    options={({ route }) => ({
                      title: t('screenNames.farmerPartialsChart'),
                    })}
                  /> */}
                </Stack.Navigator>
              </BottomSheetModalProvider>
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default BaseScreen;
