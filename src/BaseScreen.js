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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { LogBox, StatusBar, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { ToastProvider } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRecoilValue } from 'recoil';
import { initialRouteState, launcherIDsState, settingsState } from './Atoms';
import { DarkTheme, LightTheme } from './Theme';
import DashboardScreen from './v2/screens/Dashboard';
import GiveawayScreen from './v2/screens/Giveaway';
import MoreScreen from './v2/screens/More';
import PoolScreen from './v2/screens/Pool';
import NewsScreen from './screens/NewsScreen';

const Tab = createBottomTabNavigator();
// const Tab = createMaterialBottomTabNavigator();

// LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['timer']);
LogBox.ignoreLogs(['keyboardDidShow: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['keyboardDidHide: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['cycle']);

const BaseScreen = () => {
  const settings = useRecoilValue(settingsState);
  const launcherIDs = useRecoilValue(launcherIDsState);
  const initialRoute = useRecoilValue(initialRouteState);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const launcherIDsArray = Array.from(launcherIDs, ([name, value]) => ({ name, value }));
  const theme = settings.isThemeDark ? DarkTheme : LightTheme;

  const CustomToolbar = () => {
    return <View style={{ backgroundColor: 'red', flex: 1 }}></View>;
  };

  return (
    <ToastProvider>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <StatusBar
                backgroundColor={theme.colors.statusBarColor}
                barStyle="light-content"
                // barStyle={
                //   Platform.OS === 'ios' ? (isThemeDark ? 'light-content' : 'dark-content') : 'light-content'
                // }
              />
              {/* <View style={{ height: 54, backgroundColor: 'red' }}></View> */}
              <Tab.Navigator
                screenOptions={{
                  // headerStyle: {
                  //   elevation: 0, // remove shadow on Android
                  //   shadowOpacity: 0, // remove shadow on iOS
                  // },
                  // headerLeft: null,
                  // headerTitleContainerStyle: {
                  //   display: 'flex',
                  //   flex: 1,
                  // },
                  headerShown: false,
                  tabBarButton: (props) => <TouchableOpacity {...props} />,
                  tabBarItemStyle: {
                    padding: 6,
                  },
                  // tabBarActiveBackgroundColor: 'blue',
                  tabBarStyle: {
                    height: 56,
                    // padding: 16,
                    // display: 'flex',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // paddingHorizontal: 5,
                    // paddingTop: 0,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    backgroundColor: theme.colors.tabNavigatorBackground,
                    // position: 'absolute',
                    borderTopColor: theme.colors.tabNavigatorTopBorderColor,
                    // borderTopWidth: 0,
                    // padding: 16,
                  },
                  tabBarIconStyle: {
                    // backgroundColor: 'blue',
                    // display: 'none',
                    // flex: 1,
                    // paddingTop: -8,
                    // background: 'blue',
                    // color: 'blue',
                  },
                  tabBarLabelStyle: {
                    fontFamily: theme.fonts.regular.fontFamily,
                    // flex: 1,
                    // backgroundColor: 'red',
                    fontSize: 12,
                    // paddingBottom: 8,
                    // backgroundColor: 'red',
                    // position: 'absolute',
                    // textAlignVertical: 'center',
                    // paddingBottom: 8,
                  },
                }}
              >
                <Tab.Screen
                  name="Pool"
                  component={PoolScreen}
                  options={{
                    // headerTitleStyle: { alignSelf: 'center' },
                    // headerTitle: (props) => <CustomToolbar {...props} />,
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="pool" size={size} color={color} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="News"
                  component={NewsScreen}
                  options={{
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
                  name="Giveaway"
                  component={GiveawayScreen}
                  options={{
                    tabBarIcon: ({ color, size, focused }) => (
                      <Ionicons
                        name={focused ? 'gift' : 'gift-outline'}
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
                    tabBarIcon: ({ color, size, focused }) => (
                      <MaterialIcons name="read-more" size={size} color={color} />
                    ),
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ToastProvider>
  );
};

export default BaseScreen;
