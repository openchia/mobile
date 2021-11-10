/* eslint-disable react/jsx-props-no-spreading */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Node, useCallback, useMemo, useState, Suspense, useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';

import Toast, { ToastProvider } from 'react-native-toast-notifications';

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
} from 'recoil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatsScreen';
import FarmersScreen from './screens/FarmersScreen';
import BlocksFoundScreen from './screens/BlocksFoundScreen';
import PayoutScreen from './screens/PayoutScreen';
import ScanScreen from './screens/ScanScreen';
import FarmerScreen from './screens/FarmerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { launcherIDsState, themeState } from './Atoms';
import LanguageSelectorScreen from './screens/LanguageSelectorScreen';
import CurrencySelectionScreen from './screens/CurrencySelectionScreen';
import CustomDrawerContent from './components/CustomDrawerContent';
import ChartsScreen from './screens/ChartsScreen';
import LoadingComponent from './components/LoadingComponent';

// LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['timer']);

// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const LightTheme = {
  ...CombinedDefaultTheme,
  roundness: 2,
  colors: {
    ...CombinedDefaultTheme.colors,
    background: '#f5f5f5',
    border: '#0096FF',
    accent: '#c57e49',
    surface: '#f5f5f5',
    onSurface: '#fff',
    primary: '#436B34',
    primaryLight: '#69A951',
    primaryDark: '#243F1E',
    // textPrimary: '#fff',
    // textSecondary: '#436B34',
    divider: 'rgba(0, 0, 0, 0.4)',
    statusBarColor: '#436B34',
    // statusBarColor: '#243F1E',
    text: '#6E6E6E',
    textLight: '#436B34',
    textDark: '#243F1E',
    textGrey: '#6E6E6E',
    textGreyLight: '#8c8c8c',
    disabled: '#436B34',
    placeholder: '#436B34',
    backdrop: '#436B34',
    notification: '#436B34',
    leaves: 'rgba(41, 50, 57, 0.05)',
    borderColor: 'rgba(0,0,0,0.05)',
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
    textGreyLight: '#8c8c8c',
    surface: '#212428',
    accent: '#c57e49',
    onSurface: '#33373d',
    primary: '#436B34',
    primaryLight: '#69A951',
    primaryDark: '#243F1E',
    statusBarColor: '#243F1E',
    leaves: 'rgba(245, 245, 245, 0.07)',
    divider: 'rgba(255, 255, 255, 0.2)',
    disabled: '#f5f5f5',
    placeholder: '#f5f5f5',
    backdrop: '#f5f5f5',
    notification: '#f5f5f5',
    borderColor: 'rgba(0,0,0,0.05)',
  },
};

const Root = ({ theme, toggleTheme, launcherIDsArray }) => (
  <Drawer.Navigator
    drawerContent={(props) => (
      <CustomDrawerContent
        {...props}
        launcherIDsArray={launcherIDsArray}
        toggleTheme={toggleTheme}
      />
    )}
    backBehavior="history"
    initialRouteName="Home"
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
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Stats" component={StatsScreen} />
    <Drawer.Screen name="Farmers" component={FarmersScreen} />
    <Drawer.Screen name="Blocks Found" component={BlocksFoundScreen} />
    <Drawer.Screen name="Payouts" component={PayoutScreen} />
    <Drawer.Screen name="Scan Launcher ID" component={ScanScreen} />
    <Drawer.Screen name="Charts" component={ChartsScreen} />
    {/* <Divider /> */}
    {launcherIDsArray.map((item) => (
      <Drawer.Screen
        key={item.value}
        name={item.value ? item.value : item.name}
        component={FarmerScreen}
      />
    ))}
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

const AppRoot = ({ theme, toggleTheme, launcherIDsArray }) => (
  <NavigationContainer theme={theme}>
    <StatusBar backgroundColor={theme.colors.statusBarColor} barStyle="light-content" />
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: theme.colors.primary },
        gestureEnabled: true, // If you want to swipe back like iOS on Android
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="Root" options={{ headerShown: false }}>
        {() => <Root theme={theme} toggleTheme={toggleTheme} launcherIDsArray={launcherIDsArray} />}
      </Stack.Screen>
      <Stack.Screen
        name="Farmer Details"
        component={FarmerScreen}
        // options={({ route, navigation }) => ({})}
      />
      <Stack.Screen name="Language" component={LanguageSelectorScreen} />
      <Stack.Screen name="Currency" component={CurrencySelectionScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const ApplicationNavigator = () => {
  // const isThemeDark = useRecoilValueLoadable(themeState);
  // const launcherIDs = useRecoilValueLoadable(launcherIDsState);
  const isThemeDark = useRecoilValue(themeState);
  const launcherIDs = useRecoilValue(launcherIDsState);

  // if (launcherIDs.state === 'loading' || isThemeDark.state === 'loading') {
  //   return <LoadingComponent />;
  // }

  // console.log(launcherIDs.contents, isThemeDark.contents);

  // const launcherIDsArray = Array.from(launcherIDs.contents, ([name, value]) => ({ name, value }));
  // const theme = isThemeDark.contents ? DarkTheme : LightTheme;

  const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  const theme = isThemeDark ? DarkTheme : LightTheme;

  return (
    <ToastProvider>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
        <PaperProvider theme={theme}>
          <AppRoot theme={theme} launcherIDsArray={launcherIDsArray} />
        </PaperProvider>
        {/* </GestureHandlerRootView> */}
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default ApplicationNavigator;