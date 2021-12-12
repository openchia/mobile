/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Node, useCallback, useMemo, useState, Suspense, useEffect } from 'react';
import { StatusBar, LogBox, SafeAreaView, Platform } from 'react-native';

import Toast, { ToastProvider } from 'react-native-toast-notifications';
import SplashScreen from 'react-native-splash-screen';

import {
  IconButton,
  Portal,
  Dialog,
  Checkbox,
  Button,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Divider,
} from 'react-native-paper';
import merge from 'deepmerge';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  atom,
  RecoilRoot,
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatsScreen';
import FarmersScreen from './screens/FarmersScreen';
import BlocksFoundScreen from './screens/BlocksFoundScreen';
import PayoutScreen from './screens/PayoutScreen';
import ScanScreen from './screens/ScanScreen';
import FarmerScreen, { getHeaderTitle } from './screens/farmer/FarmerScreen';
import SettingsScreen from './screens/SettingsScreen';
import {
  currencyState,
  initialRouteState,
  launcherIDsState,
  networkState,
  settingsState,
} from './Atoms';
import LanguageSelectorScreen from './screens/LanguageSelectorScreen';
import CurrencySelectionScreen from './screens/CurrencySelectionScreen';
import CustomDrawerContent from './components/CustomDrawerContent';
import PoolspaceScreen from './screens/charts/PoolspaceScreen';
import NewsScreen from './screens/NewsScreen';
import NewsPostScreen from './screens/NewsPostScreen';
import FarmerSettingsScreen from './screens/farmer/FarmerSettingsScreen';
import FarmerNameScreen from './screens/farmer/FarmerNameScreen';
import GiveawaySceen from './screens/giveaway/GiveawayScreen';
import ChiaPriceScreen from './screens/charts/ChiaPriceScreen';

// LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['timer']);
LogBox.ignoreLogs(['keyboardDidShow: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['keyboardDidHide: ...']); // Ignore log notification by message

const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const LightTheme = {
  ...CombinedDefaultTheme,
  roundness: 2,
  colors: {
    ...CombinedDefaultTheme.colors,
    background: '#ebebeb',
    border: '#436B34',
    accent: '#c57e49',
    surface: '#f5f5f5',
    onSurface: '#fff',
    primary: '#436B34',
    primaryLight: '#69A951',
    primaryDark: '#243F1E',
    accentColor: '#4B4E97',
    // textPrimary: '#fff',
    // textSecondary: '#436B34',
    divider: 'rgba(0, 0, 0, 0.4)',
    selected: 'rgba(0, 0, 0, 0.2)',
    statusBarColor: '#436B34',
    // statusBarColor: '#243F1E',
    text: '#636363',
    textLight: '#436B34',
    textDark: '#243F1E',
    textGrey: '#8c8c8c',
    drawerText: '#636363',
    textGreyLight: '#8c8c8c',
    // disabled: '#436B34',
    placeholder: '#8c8c8c',
    // backdrop: '#436B34',
    notification: '#436B34',
    leaves: 'rgba(41, 50, 57, 0.05)',
    borderColor: 'rgba(0,0,0,0.05)',
    tabNavigator: '#436B34',
    tabNavigatorText: '#f5f5f5',
    jellyBarText: '#424242',
    drawerSelected: '#436B34',
  },
};

const DarkTheme = {
  ...CombinedDarkTheme,
  roundness: 2,
  colors: {
    ...CombinedDarkTheme.colors,
    background: '#212428',
    // text: '#ffffff',
    text: '#ffffff',
    textLight: '#70b056',
    textDark: '#243F1E',
    textGrey: '#bababa',
    drawerText: '#bababa',
    textGreyLight: '#8c8c8c',
    accentColor: '#f5f5f5',
    surface: '#212428',
    accent: '#c57e49',
    onSurface: '#33373d',
    primary: '#436B34',
    primaryLight: '#69A951',
    primaryDark: '#243F1E',
    statusBarColor: '#243F1E',
    leaves: 'rgba(245, 245, 245, 0.07)',
    divider: 'rgba(255, 255, 255, 0.2)',
    selected: 'rgba(255, 255, 255, 0.2)',
    // disabled: '#f5f5f5',
    placeholder: '#bababa',
    enabled: 'pink',
    // backdrop: '#f5f5f5',
    notification: '#f5f5f5',
    borderColor: 'rgba(0,0,0,0.05)',
    tabNavigator: '#436B34',
    tabNavigatorText: '#f5f5f5',
    jellyBarText: '#f5f5f5',
    drawerSelected: '#70b056',
  },
};

const Root = ({ theme, toggleTheme, launcherIDsArray, initialRoute, t }) => (
  <Drawer.Navigator
    drawerContent={(props) => (
      <CustomDrawerContent
        {...props}
        launcherIDsArray={launcherIDsArray}
        toggleTheme={toggleTheme}
      />
    )}
    backBehavior="history"
    initialRouteName={initialRoute.name}
    // useLegacyImplementation
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: theme.colors.primary },
      // drawerActiveTintColor: theme.colors.text,
      drawerActiveTintColor: 'black',
      headerTintColor: '#fff',
      inactiveTintColor: 'black',
      activeTintColor: 'red',
      activeBackgroundColor: 'grey',
      navigationOptions: {
        headerBackTitle: 'Back',
      },
      // inactiveTintColor: 'blue',
      inactiveBackgroundColor: 'white',
      labelStyle: {
        marginLeft: 5,
      },
      // drawerActiveBackgroundColor: { background: 'red' },
      // drawerContentContainerStyle: { backgroundColor: 'red' },
      // labelStyle: { color: 'black' }
      drawerStyle: { backgroundColor: theme.colors.surface },
    }}
  >
    <Drawer.Screen
      name="Home"
      component={HomeScreen}
      // options={({ route }) => ({
      //   title: 'Test',
      // })}
    />
    <Drawer.Screen
      name="News"
      component={NewsScreen}
      options={() => ({
        title: t('news'),
      })}
    />
    <Drawer.Screen
      name="Stats"
      component={StatsScreen}
      options={() => ({
        title: t('stats'),
      })}
    />
    <Drawer.Screen
      name="Farmers"
      component={FarmersScreen}
      options={() => ({
        title: t('farmers'),
      })}
    />
    <Drawer.Screen
      name="Blocks Found"
      component={BlocksFoundScreen}
      options={() => ({
        title: t('blocksFound'),
      })}
    />
    <Drawer.Screen
      name="Payouts"
      component={PayoutScreen}
      options={() => ({
        title: t('payouts'),
      })}
    />
    <Drawer.Screen
      name="Giveaway"
      component={GiveawaySceen}
      options={() => ({
        title: t('giveaway'),
      })}
    />
    <Drawer.Screen
      name="Farmer Details Drawer"
      component={FarmerScreen}
      options={({ route }) => ({
        title: getHeaderTitle(route, t),
        headerRight: () => (
          <Button onPress={() => alert('This is a button!')} title="Info" color="#fff" />
        ),
      })}
    />
    {launcherIDsArray.map((item) => (
      <Drawer.Screen
        key={item.name}
        name={item.name ? item.name : item.value.name}
        component={FarmerScreen}
      />
    ))}
  </Drawer.Navigator>
);

const AppRoot = ({ theme, toggleTheme, launcherIDsArray, isThemeDark, initialRoute }) => {
  const { t } = useTranslation();
  return (
    // const isDrawerOpen = useDrawerStatus() === 'open';
    <NavigationContainer theme={theme}>
      <StatusBar
        backgroundColor={theme.colors.statusBarColor}
        barStyle="light-content"
        // barStyle={
        //   Platform.OS === 'ios' ? (isThemeDark ? 'light-content' : 'dark-content') : 'light-content'
        // }
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: theme.colors.primary },
          headerBackTitleVisible: false,
          gestureEnabled: true, // If you want to swipe back like iOS on Android
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Root" options={{ headerShown: false }}>
          {() => (
            <Root
              theme={theme}
              toggleTheme={toggleTheme}
              launcherIDsArray={launcherIDsArray}
              initialRoute={initialRoute}
              t={t}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Farmer Details"
          component={FarmerScreen}
          options={({ route }) => ({
            // title: getHeaderTitle(route, t),
            headerRight: () => (
              <Button onPress={() => alert('This is a button!')} title="Info" color="#fff" />
            ),
          })}
          // options={({ route, navigation }) => ({})}
        />
        <Stack.Screen
          name="Post"
          component={NewsPostScreen}
          options={() => ({
            title: t('post'),
          })}
        />
        <Stack.Screen
          name="Farmer Settings"
          component={FarmerSettingsScreen}
          options={() => ({
            title: t('farmerSettings'),
          })}
        />
        <Stack.Screen
          name="Language"
          component={LanguageSelectorScreen}
          options={() => ({
            title: t('language'),
          })}
        />
        <Stack.Screen
          name="Currency"
          component={CurrencySelectionScreen}
          options={() => ({
            title: t('currency'),
          })}
        />
        <Stack.Screen
          name="Poolspace"
          component={PoolspaceScreen}
          options={() => ({
            title: t('poolSpace'),
          })}
        />
        <Stack.Screen
          name="Chia Price Chart"
          component={ChiaPriceScreen}
          options={() => ({
            title: t('chiaPriceChart'),
          })}
        />
        <Stack.Screen
          name="Farmer Name"
          component={FarmerNameScreen}
          options={() => ({
            title: t('farmName'),
          })}
        />
        <Stack.Screen
          name="Verify Farm"
          component={ScanScreen}
          options={() => ({
            title: t('verifyFarm'),
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={() => ({
            title: t('settings'),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const ApplicationNavigator = () => {
  const settings = useRecoilValue(settingsState);
  const launcherIDs = useRecoilValue(launcherIDsState);
  const initialRoute = useRecoilValue(initialRouteState);
  const currency = useRecoilValue(currencyState);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  const theme = settings.isThemeDark ? DarkTheme : LightTheme;

  return (
    <ToastProvider>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={theme}>
            <AppRoot
              theme={theme}
              launcherIDsArray={launcherIDsArray}
              isThemeDark={settings.isThemeDark}
              initialRoute={initialRoute}
            />
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default ApplicationNavigator;
