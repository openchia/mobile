/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Node, useCallback, useMemo, useState, Suspense } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  IconButton,
  Portal,
  Dialog,
  Checkbox,
  Button,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import merge from 'deepmerge';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { atom, RecoilRoot, useRecoilState } from 'recoil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { textState } from './src/Atoms';
import HomeScreen from './src/screens/HomeScreen';
import { ThemeContextProvider } from './src/contexts/ThemeContext';
import StatsScreen from './src/screens/StatsScreen';
import FarmersScreen from './src/screens/FarmersScreen';
import BlocksFoundScreen from './src/screens/BlocksFoundScreen';
import PayoutScreen from './src/screens/PayoutScreen';
import FarmerScreen from './src/screens/FarmerScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
// const Drawer = createDrawerNavigator();

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
    backdrop: '#0096FF',
    surface: '#0096FF',
    onSurface: '#0096FF',
    primary: '#008640',
    text: '#fff',
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
    primary: '#329f4d',
    leaves: 'rgba(245, 245, 245, 0.07)',
  },
};

const App = () => {
  const [isThemeDark, setIsThemeDark] = useState(false);

  const theme = isThemeDark ? DarkTheme : LightTheme;

  const toggleTheme = useCallback(
    () =>
      // saveObject(!isThemeDark, 'isThemeDark');
      setIsThemeDark(!isThemeDark),
    [isThemeDark]
  );

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  const Root = () => (
    <Drawer.Navigator
      backBehavior="history"
      initialRouteName="Stats"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        drawerActiveTintColor: theme.colors.text,
        headerTintColor: '#fff',
        // drawerActiveBackgroundColor: { background: 'red' },
        // drawerContentContainerStyle: { backgroundColor: 'red' },
        drawerStyle: { backgroundColor: theme.colors.primary },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Stats" component={StatsScreen} />
      <Drawer.Screen name="Farmers" component={FarmersScreen} />
      <Drawer.Screen name="Blocks Found" component={BlocksFoundScreen} />
      <Drawer.Screen name="Payouts" component={PayoutScreen} />
    </Drawer.Navigator>
  );

  return (
    <RecoilRoot>
      <ThemeContextProvider value={preferences}>
        <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <Stack.Navigator>
                <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
                <Stack.Screen
                  name="Farmer"
                  component={FarmerScreen}
                  // options={{ headerShown: false, title: 'hello' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
            {/* </Suspense> */}
          </PaperProvider>
        </SafeAreaProvider>
      </ThemeContextProvider>
    </RecoilRoot>
  );
};

export default App;
