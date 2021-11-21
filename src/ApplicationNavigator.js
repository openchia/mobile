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
} from 'recoil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, useDrawerStatus } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatsScreen';
import FarmersScreen from './screens/FarmersScreen';
import BlocksFoundScreen from './screens/BlocksFoundScreen';
import PayoutScreen from './screens/PayoutScreen';
import ScanScreen from './screens/ScanScreen';
import FarmerScreen, { getHeaderTitle } from './screens/FarmerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { initialRouteState, launcherIDsState, settingsState } from './Atoms';
import LanguageSelectorScreen from './screens/LanguageSelectorScreen';
import CurrencySelectionScreen from './screens/CurrencySelectionScreen';
import CustomDrawerContent from './components/CustomDrawerContent';
import ChartsScreen from './screens/ChartsScreen';
import NewsScreen from './screens/NewsScreen';
import NewsPostScreen from './screens/NewsPostScreen';

// LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['timer']);
LogBox.ignoreLogs(['keyboardDidShow: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['keyboardDidHide: ...']); // Ignore log notification by message

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
    disabled: '#f5f5f5',
    placeholder: '#f5f5f5',
    backdrop: '#f5f5f5',
    notification: '#f5f5f5',
    borderColor: 'rgba(0,0,0,0.05)',
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
    initialRouteName={initialRoute}
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
    <Drawer.Screen name={t('navigate:home')} component={HomeScreen} />
    <Drawer.Screen name={t('navigate:news')} component={NewsScreen} />
    <Drawer.Screen name={t('navigate:stats')} component={StatsScreen} />
    <Drawer.Screen name={t('navigate:farmers')} component={FarmersScreen} />
    <Drawer.Screen name={t('navigate:blocksFound')} component={BlocksFoundScreen} />
    <Drawer.Screen name={t('navigate:payouts')} component={PayoutScreen} />
    <Drawer.Screen name={t('navigate:verifyFarm')} component={ScanScreen} />
    <Drawer.Screen name={t('navigate:charts')} component={ChartsScreen} />
    {/* <Divider /> */}
    {launcherIDsArray.map((item) => (
      <Drawer.Screen
        key={item.name}
        name={item.name ? item.name : item.value.name}
        component={FarmerScreen}
      />
    ))}
    <Drawer.Screen name="Settings" component={SettingsScreen} />
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
          ...TransitionPresets.SlideFromRightIOS,
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
            title: getHeaderTitle(route, t),
            headerRight: () => (
              <Button onPress={() => alert('This is a button!')} title="Info" color="#fff" />
            ),
          })}
          // options={({ route, navigation }) => ({})}
        />
        <Stack.Screen name="Post" component={NewsPostScreen} />
        <Stack.Screen name={t('common:language')} component={LanguageSelectorScreen} />
        <Stack.Screen name={t('common:currency')} component={CurrencySelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const ApplicationNavigator = () => {
  // const isThemeDark = useRecoilValueLoadable(themeState);
  // const launcherIDs = useRecoilValueLoadable(launcherIDsState);
  const settings = useRecoilValue(settingsState);
  const launcherIDs = useRecoilValue(launcherIDsState);
  const initialRoute = useRecoilValue(initialRouteState);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // if (launcherIDs.state === 'loading' || isThemeDark.state === 'loading') {
  //   return <LoadingComponent />;
  // }

  // console.log(launcherIDs.contents, isThemeDark.contents);

  // const launcherIDsArray = Array.from(launcherIDs.contents, ([name, value]) => ({ name, value }));
  // const theme = isThemeDark.contents ? DarkTheme : LightTheme;

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
