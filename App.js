/* eslint-disable react/jsx-props-no-spreading */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Node, useCallback, useMemo, useState, Suspense, useEffect } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  LogBox,
} from 'react-native';
import './src/constants/IMLocalize';

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
import { textState, launcherIDsState } from './src/Atoms';
import HomeScreen from './src/screens/HomeScreen';
import { ThemeContextProvider } from './src/contexts/ThemeContext';
import StatsScreen from './src/screens/StatsScreen';
import FarmersScreen from './src/screens/FarmersScreen';
import BlocksFoundScreen from './src/screens/BlocksFoundScreen';
import PayoutScreen from './src/screens/PayoutScreen';
import FarmerScreen from './src/screens/FarmerScreen';
import LoadingComponent from './src/components/LoadingComponent';
import DrawerContent from './src/components/DrawerContent';
import ScanScreen from './src/screens/ScanScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LanguageSelectorScreen from './src/screens/LanguageSelectorScreen';

LogBox.ignoreLogs(['Reanimated 2']);
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
    onSurface: '#0096FF',
    // primary: '#008640',
    primary: '#119400',
    divider: '#fff',
    text: 'grey',
    disabled: 'black',
    placeholder: 'black',
    backdrop: 'black',
    notification: 'black',
    leaves: 'rgba(41, 50, 57, 0.05)',
  },
};

const DarkTheme = {
  ...CombinedDarkTheme,
  roundness: 2,
  colors: {
    ...CombinedDarkTheme.colors,
    background: '#293239',
    text: '#ffffffff',
    surface: '#20272c',
    accent: '#c57e49',
    primary: '#119400',
    // primary: '#329f4d',
    leaves: 'rgba(245, 245, 245, 0.07)',
  },
};

const Root = ({ launcherIDs, theme, toggleTheme }) => {
  // const launcherIDs = useRecoilValue(launcherIDsState);
  // console.log(launcherIDs);
  const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  // console.log(array);

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContent {...props} launcherIDsArray={launcherIDsArray} toggleTheme={toggleTheme} />
      )}
      backBehavior="history"
      initialRouteName="Home"
      useLegacyImplementation
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
        // drawerStyle: { backgroundColor: theme.colors.primary, labelStyle: { color: 'black' } },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Stats" component={StatsScreen} />
      <Drawer.Screen name="Farmers" component={FarmersScreen} />
      <Drawer.Screen name="Blocks Found" component={BlocksFoundScreen} />
      <Drawer.Screen name="Payouts" component={PayoutScreen} />
      <Drawer.Screen name="Scan Launcher ID" component={ScanScreen} />
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

const AppRoot = ({ theme, toggleTheme }) => {
  const launcherIDs = useRecoilValue(launcherIDsState);

  return (
    <NavigationContainer theme={theme}>
      <StatusBar backgroundColor="#047300" barStyle="light-content" />
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
          {() => <Root launcherIDs={launcherIDs} theme={theme} toggleTheme={toggleTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Farmer Details"
          component={FarmerScreen}
          // options={({ route, navigation }) => ({})}
        />
        <Stack.Screen name="Language" component={LanguageSelectorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const [isThemeDark, setIsThemeDark] = useState(false);

  const theme = isThemeDark ? DarkTheme : LightTheme;

  const toggleTheme = useCallback(() => {
    setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <RecoilRoot>
      <ThemeContextProvider value={preferences}>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
          <PaperProvider theme={theme}>
            <Suspense fallback={<LoadingComponent />}>
              <AppRoot theme={theme} toggleTheme={toggleTheme} />
            </Suspense>
          </PaperProvider>
        </SafeAreaProvider>
      </ThemeContextProvider>
    </RecoilRoot>
  );
};

export default App;
