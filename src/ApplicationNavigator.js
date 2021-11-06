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
import { atom, RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
import NetspaceScreen from './screens/NetspaceScreen';

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
    primary: '#119400',
    textPrimary: '#119400',
    divider: '#fff',
    primaryDark: '#119400',
    statusBarColor: '#047300',
    text: 'grey',
    disabled: 'grey',
    placeholder: 'grey',
    backdrop: 'grey',
    notification: 'grey',
    leaves: 'rgba(41, 50, 57, 0.05)',
    borderColor: '#fff',
  },
};

const DarkTheme = {
  ...CombinedDarkTheme,
  roundness: 2,
  colors: {
    ...CombinedDarkTheme.colors,
    background: '#212428',
    text: '#ffffffff',
    surface: '#212428',
    accent: '#c57e49',
    onSurface: '#33373d',
    textPrimary: '#119400',
    primary: '#004a25',
    primaryDark: '#004a25',
    statusBarColor: '#002e17',
    leaves: 'rgba(245, 245, 245, 0.07)',
    divider: '#fff',
    disabled: '#f5f5f5',
    placeholder: '#f5f5f5',
    backdrop: '#f5f5f5',
    notification: '#f5f5f5',
    borderColor: '#2e323b',
  },
};

const Root = ({ theme, toggleTheme }) => {
  const launcherIDs = useRecoilValue(launcherIDsState);
  const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));

  return (
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
      <Drawer.Screen name="Netspace" component={NetspaceScreen} />
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
};

const AppRoot = ({ theme, toggleTheme }) => (
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
        {() => <Root theme={theme} toggleTheme={toggleTheme} />}
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
  const isThemeDark = useRecoilValue(themeState);

  const theme = isThemeDark ? DarkTheme : LightTheme;

  return (
    <ToastProvider>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        <PaperProvider theme={theme}>
          <AppRoot theme={theme} />
        </PaperProvider>
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default ApplicationNavigator;
