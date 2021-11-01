/* eslint-disable react/jsx-props-no-spreading */
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();
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
    surface: '#0096FF',
    onSurface: '#0096FF',
    primary: '#008640',
    divider: '#fff',
    text: '#fff',
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
    primary: '#329f4d',
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
      initialRouteName="Stats"
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
      {/* <Divider /> */}
      {launcherIDsArray.map((item) => (
        <Drawer.Screen
          key={item.value}
          name={item.value ? item.value : item.name}
          component={StatsScreen}
        />
      ))}
    </Drawer.Navigator>
  );
};

const AppRoot = ({ theme, toggleTheme }) => {
  const launcherIDs = useRecoilValue(launcherIDsState);
  // console.log('called');
  // console.log(Array.from(launcherIDs).map((item) => console.log(item)));
  const x = 1;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.primary },
          // drawerActiveTintColor: theme.colors.text,
          // drawerActiveTintColor: '#000',
          headerTintColor: '#fff',
          // drawerActiveBackgroundColor: { background: 'red' },
          // drawerContentContainerStyle: { backgroundColor: 'red' },
          drawerStyle: { backgroundColor: theme.colors.primary },
        }}
      >
        <Stack.Screen name="Root" options={{ headerShown: false }}>
          {() => <Root launcherIDs={launcherIDs} theme={theme} toggleTheme={toggleTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Farmer Details"
          component={FarmerScreen}
          options={({ route, navigation }) => ({
            // headerStyle: {
            //   backgroundColor: theme.colors.background,
            // },
            // headerLeft: (props) => (
            //   <IconButton
            //     style={{ marginStart: 16 }}
            //     icon="cog"
            //     onPress={() => navigation.navigate('Settings')}
            //   />
            // ),
            // headerTitle: '',
            // headerRight: () => (
            //   <View
            //     style={{
            //       display: 'flex',
            //       flexDirection: 'row',
            //       marginEnd: -12,
            //       alignItems: 'center',
            //     }}
            //   >
            //     <IconButton icon="content-save" size={24} onPress={() => {}} />
            //   </View>
            // ),
          })}
        />
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
